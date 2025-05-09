import { ChangeEvent, FormEvent } from "react";
import { NavigateFunction } from "react-router-dom";
import ViewComponent from "../interfaces/ViewComponent";
import { observer } from "mobx-react-lite";
import { Box, Button, Container, FormControl, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { action, computed, makeObservable, observable } from "mobx";
import GlobalEntities from "../store/GlobalEntities";
import AlertBar from "../components/AlertBar";

export default class Register implements ViewComponent {

  public newUser = {
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  }

  public errors = {
    name: "",
    nameError: false,
    email: "",
    emailError: false,
    password: "",
    passwordError: false,
    password_confirmation: "",
    password_confirmationError: false
  }

  constructor(public navigate: NavigateFunction) {
    makeObservable(this, {
      newUser: observable,
      errors: observable,
      submitForm: action,
      handleChange: action,
    });
  }

  @computed get Alert() {
    return new AlertBar;
 }

  @action submitForm = async (event: FormEvent) => {
    event.preventDefault();

    if (!this.checkErrors()) {
      const resp = await GlobalEntities.register(this.newUser);
      if (resp.code === 1) {
        
        this.Alert.toggleAlert(true, resp.message, "success");
        setTimeout(() => {
          this.navigate("/login");
         }, 2500)
        
      }
      else {
        this.Alert.toggleAlert(true, resp.message, "error");
      }
    }
  }

  @action handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    this.newUser = { ...this.newUser, [event.target.name]: event.target.value as string }
    await this.validateForm();
  }

  @action validateForm = async () => {
    const emails = await GlobalEntities.getUsedEmail();
  
    switch (true) {
      case this.newUser.name === "":
        this.errors.name = "Név megadása kötelező";
        this.errors.nameError = true;
        return;
  
      case this.newUser.email === "":
        this.setErrorsDefault();
        this.errors.email = "E-mail cím megadása kötelező";
        this.errors.emailError = true;
        return;
  
      case !this.newUser.email.includes("@"):
        this.setErrorsDefault();
        this.errors.email = "Valós E-mail cím megadása kötelező";
        this.errors.emailError = true;
        return;
  
      case emails.includes(this.newUser.email):
        this.setErrorsDefault();
        this.errors.email = "Ez az e-mail cím már foglalt";
        this.errors.emailError = true;
        return;
  
      case this.newUser.password === "":
        this.setErrorsDefault();
        this.errors.password = "Jelszó megadása kötelező";
        this.errors.passwordError = true;
        return;
  
      case this.newUser.password.length < 8:
        this.setErrorsDefault();
        this.errors.password = "Jelszónak minimum 8 karakter hosszúnak kell lennie";
        this.errors.passwordError = true;
        return;
  
      case this.newUser.password_confirmation !== this.newUser.password:
        this.setErrorsDefault();
        this.errors.password_confirmation = "A jelszó nem egyezik";
        this.errors.password_confirmationError = true;
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
      emailError: false,
      password: "",
      passwordError: false,
      password_confirmation: "",
      password_confirmationError: false
    }
  }

  @action checkErrors = () => {
    const errors = this.errors
    if (errors.emailError || errors.nameError || errors.passwordError || errors.password_confirmationError) {
      return true
    }
    return false;
  }

  View = observer(() =>
    <Container sx={{ marginTop: "4rem" }}>
      <Stack component={Paper}
        elevation={3}
        sx={{
          maxWidth: 400,
          mx: "auto",
          p: 4,
          borderRadius: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          backgroundColor: "background.paper",

        }}>
        <Typography variant="h3" component="h1" gutterBottom>Regisztráció</Typography>
        <Box
          component="form"
          onSubmit={this.submitForm}
          noValidate
        >
          <Stack direction={"column"} gap={4}>
            <FormControl>
              <TextField
                label="Felhasználó név"
                id="name"
                name="name"
                error={this.errors.nameError}
                helperText={this.errors.name}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl>
              <TextField
                label="E-mail cím"
                id="email"
                name="email"
                type="email"
                error={this.errors.emailError}
                helperText={this.errors.email}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl>
              <TextField
                label="Jelszó"
                id="password"
                name="password"
                type="password"
                error={this.errors.passwordError}
                helperText={this.errors.password}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl>
              <TextField
                label="Jelszó újra"
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                error={this.errors.password_confirmationError}
                helperText={this.errors.password_confirmation}
                onChange={this.handleChange}
              />
            </FormControl>
            <Stack direction={{ sx: "column", sm: "row" }} justifyContent={"end"}>
              <Button type="submit" variant="contained" >Regisztrálok</Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
        {<this.Alert.View />}
    </Container>
  );
}