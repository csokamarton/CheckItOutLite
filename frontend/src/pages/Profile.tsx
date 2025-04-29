import { observer } from "mobx-react-lite";
import ViewComponent from "../interfaces/ViewComponent";
import { Button, Container, FormControl, Modal, Snackbar, Stack, TextField } from "@mui/material";
import GlobalEntities from "../store/GlobalEntities";
import { NavigateFunction } from "react-router-dom";
import { action, computed, makeObservable, observable } from "mobx";
import { ChangeEvent, FormEvent } from "react";
import AlertBar from "../components/AlertBar";

export default class Profile implements ViewComponent {

    style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40vw',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        borderRadius: '12px',
        boxShadow: 24,
        p: 4,
        margin: 'auto'
    };

    constructor(public naviagte: NavigateFunction) {
        this.name = (GlobalEntities.user.name as string);
        this.email = (GlobalEntities.user.email as string);
        makeObservable(this, {
            showModal: observable,
            editable: observable,
            name: observable,
            email: observable,
            errors: observable,
            alertStatus: observable,
            alertMessage: observable,
            alertType: observable,
            toggleEdit: action,
            abortEdit: action,
            toggleModal: action,
            handleChange: action,
            validateForm: action,
            setErrorsDefault: action,
        })
    }

    public editable: boolean = false;
    public showModal: boolean = false;
    public name: string;
    public email: string;
    public alertStatus = false;
    public alertMessage = "";
    public alertType = "";

    public errors = {
        name: "",
        nameError: false,
        email: "",
        emailError: false
    }

    @action toggleEdit = () => {
        this.editable = !this.editable;
    }

    @action toggleModal = () => {
        this.showModal = !this.showModal;
    }

    @action handleChange = async (e: ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;

        if (name === "name") {
            this.name = value;
        }
        else {
            this.email = value;
        }

        await this.validateForm();
    }

    @action abortEdit = async () => {
        this.name = (GlobalEntities.user.name as string);
        this.email = (GlobalEntities.user.email as string);
        this.toggleModal();
        await this.validateForm();
        this.toggleEdit();
    }

    @action submitEdit = async (e: any) => {
        e.preventDefault();

        const resp = await GlobalEntities.updateUser(this.name, this.email, e.target.password.value);
        if (resp != 0) {
            this.Alert.toggleAlert(true, resp as string, "success")
            this.abortEdit();
        }
        else {
            this.Alert.toggleAlert(true, "Sikertelen módosítás", "error")
            this.abortEdit();
        }
    }

    @action validateForm = async () => {
        const emails = await GlobalEntities.getUsedEmail();
      
        switch (true) {
          case this.name === "":
            this.errors.name = "Név megadása kötelező";
            this.errors.nameError = true;
            return;
      
          case this.email === "":
            this.setErrorsDefault();
            this.errors.email = "E-mail cím megadása kötelező";
            this.errors.emailError = true;
            return;
      
          case !this.email.includes("@"):
            this.setErrorsDefault();
            this.errors.email = "Valós e-mail cím megadása kötelező";
            this.errors.emailError = true;
            return;
      
          case emails.includes(this.email):
            this.setErrorsDefault();
            this.errors.email = "Ez az e-mail cím már foglalt";
            this.errors.emailError = true;
            return;
      
          default:
            this.setErrorsDefault();
        }
      };
      

    @action setErrorsDefault = () => {
        this.errors = {
            name: "",
            nameError: false,
            email: "",
            emailError: false
        }
    }


    @computed get Alert() {
        return new AlertBar;
    }

    View = observer(() => (
        <Container sx={{ marginY: "2rem" }}>
            <form noValidate>
                <Stack direction={"column"}>
                    <FormControl>
                        <TextField
                            id="name"
                            name="name"
                            sx={{ paddingBottom: 3 }}
                            label="Felhasználó név"
                            value={this.name}
                            disabled={!this.editable}
                            onChange={this.handleChange}
                            error={this.errors.nameError}
                            helperText={this.errors.name}
                        />
                        <TextField
                            id="email"
                            name="email"
                            label="E-mail cím"
                            value={this.email}
                            disabled={!this.editable}
                            onChange={this.handleChange}
                            error={this.errors.emailError}
                            helperText={this.errors.email}
                        />
                    </FormControl>
                </Stack>
                <Stack sx={{ marginTop: "2rem" }} direction={{ xs: "column-reverse", sm: "row" }} gap={2}>
                    {
                        this.editable
                            ?
                            <><Button sx={{ margin: "auto" }} variant='contained' onClick={this.toggleEdit} color="error">
                                Mégse
                            </Button><Button sx={{ margin: "auto" }} variant='contained' onClick={this.toggleModal} color="success">
                                    Mentés
                                </Button></>
                            :
                            <Button sx={{ margin: "auto" }} variant='contained' onClick={this.toggleEdit}>
                                Szerkesztés
                            </Button>
                    }

                </Stack>
            </form>
            <Modal
                open={this.showModal}
                onClose={this.toggleModal}
            >
                <Stack sx={this.style} textAlign={"center"}>
                    <h1>Biztosan menti?</h1>
                    <Stack>
                        <p>Felhasználó név: {this.name}</p>
                        <p>E-mail cím: {this.email}</p>
                    </Stack>
                    <FormControl>
                        <form onSubmit={this.submitEdit}>
                            <TextField id="password" type="password" label="Jelszó" variant="standard" />

                            <Stack direction={{ xs: "column-reverse", sm: "row" }} justifyContent={"space-between"} padding={2} gap={2}>
                                <Button onClick={this.abortEdit} variant="contained" color="error">Mégse</Button>
                                <Button type="submit" variant="contained" color="success">Rendben</Button>
                            </Stack>
                        </form>
                    </FormControl>

                </Stack>
            </Modal>

            {< this.Alert.View />}
        </Container>
    ));
}