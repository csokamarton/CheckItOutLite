import { action, makeObservable, observable } from "mobx";
import ViewComponent from "../interfaces/ViewComponent";
import { Card, Heading } from "@chakra-ui/react";
import { Alert, Button, Snackbar, Stack } from '@mui/material';
import GlobalEntities from "../store/GlobalEntities";
import { observer } from "mobx-react-lite";


export class BaseCard implements ViewComponent {
    task: Task;
    category: Category;
    showAlert: boolean = false;
    alertMessage: string = "";
    alertType: string = "";

    constructor(task: Task) {
        this.task = task;

        const idx = GlobalEntities.categories.findIndex((element) => element.id === task.category_id);

        this.category = GlobalEntities.categories[idx];

        makeObservable(this, {
            task: observable,
            toggleStatus: action,
            showAlert: observable,
            alertMessage: observable,
            handleClose: action,
            alertType: observable
        })
    }

    @action toggleStatus = async (newStatus: string) => {
        this.task.status = newStatus;
        this.task.user_id = (GlobalEntities.user.id as number);

        const resp = await GlobalEntities.updateTask(this.task);
        if (resp.status === 200) {
            this.toggleAlert(true, `Állapot sikeresen módosítva: ${newStatus}`, "success");
        }
        else {
            this.toggleAlert(true, "Sikertelen módosítás", "error");
        }
    }

    @action handleClose = () => {
        this.toggleAlert(false, "", "");
    }

    @action toggleAlert = (open: boolean, message: string, type: string) => {
        this.showAlert = open;
        this.alertMessage = message;
        this.alertType = type;
    }

    View = observer( () => (
        <Card.Root css={{ "boxShadow": "1px 3px 4px 5px rgb(0,0,0,0.2)", "borderRadius": "0.5rem", "maxWidth":"720px", "margin":"5rem auto" }}>
            <Card.Body>
                <Card.Header>
                    <Heading size="md">{this.task.title}</Heading>
                </Card.Header>
                <Card.Description>
                    {this.task.description}
                </Card.Description>
                <Card.Description>
                    {this.task.due_date.toString()}
                </Card.Description>
                    Állapot: {this.task.status} | Prioritás: {this.task.priority}
                <Card.Description>                
                    Kategória: {this.category.name}                
                </Card.Description>
            </Card.Body>
            <Card.Footer display="flex" justifyContent="flex-end" >
                <Stack sx={{flexWrap: 'wrap'}} spacing={2.5} direction="row" margin={"1rem"} useFlexGap>
                    <Button sx={{margin: 'auto!important'}} onClick={() => this.toggleStatus("folyamatban")} variant="contained" color="warning">Folyamatban</Button>
                    <Button sx={{margin: 'auto!important', xs:{marginTop: '1rem!important'}}} onClick={() => this.toggleStatus("kész")} variant="contained" color="success">Kész</Button>
                </Stack>

            </Card.Footer>
            
            <Snackbar 
                open={this.showAlert} 
                autoHideDuration={6000} 
                onClose={this.handleClose}
            >
                <Alert variant="filled">{this.alertMessage}</Alert>
            </Snackbar>
            
        </Card.Root>
    ));



}