import { action, makeObservable, observable } from "mobx";
import ViewComponent from "../interfaces/ViewComponent";
import { observer } from "mobx-react-lite";
import { Alert, AlertColor, Snackbar } from "@mui/material";


export default class AlertBar implements ViewComponent {

    public showAlert: boolean = false;
    public alertMessage: string = "";
    public alertType: string = "";

    constructor() {
        makeObservable(this, {
            showAlert: observable,
            alertMessage: observable,
            handleClose: action,
            alertType: observable
        })
    }

    @action handleClose = () => {
        this.toggleAlert(false, "", "");
    }

    @action toggleAlert = (open: boolean, message: string, type: string) => {
        this.showAlert = open;
        this.alertMessage = message;
        this.alertType = type;
    }

    View = observer(() =>
        <Snackbar
        open={this.showAlert}
        autoHideDuration={6000}
        onClose={this.handleClose}
      >
        <Alert variant="filled" severity={this.alertType as AlertColor}>
          {this.alertMessage}
        </Alert>
      </Snackbar>
    ); 
}