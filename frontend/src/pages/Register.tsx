import { ChangeEvent, FormEvent } from "react";
import { NavigateFunction } from "react-router-dom";
import ViewComponent from "../interfaces/ViewComponent";
import { observer } from "mobx-react-lite";
import { Box, Button, Container, FormControl, Stack, TextField } from "@mui/material";
import { action, makeObservable, observable } from "mobx";
import GlobalEntities from "../store/GlobalEntities";

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
      handleChange: action
    });
  }

  @action submitForm = async(event: FormEvent) => {
    event.preventDefault();

    if (!this.checkErrors()) {
      const resp = await GlobalEntities.register(this.newUser);
      if (resp.code === 1) {
        alert(resp.message);
        this.navigate("/login");
      }
      else{
        alert(resp.message);
      }
    }
  }

  @action handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.newUser = { ...this.newUser, [event.target.name]: event.target.value as string}
    this.validateForm();
  }

  @action validateForm = () => {
    if(this.newUser.name === "") {
      this.errors.name = "Név megadása kötelező";
      this.errors.nameError = true;
      return;
    }
    this.setErrorsDefault();
    if(this.newUser.email === "") {
      this.errors.email = "E-mail cím megadása kötelező";
      this.errors.emailError = true;
      return;
    }
    this.setErrorsDefault();
    if(!this.newUser.email.includes("@")) {
      this.errors.email = "Valós E-mail cím megadása kötelező";
      this.errors.emailError = true;
      return;
    }
    this.setErrorsDefault();
    if(this.newUser.password === "") {
      this.errors.password = "Jelszó megadása kötelező";
      this.errors.passwordError = true;
      return;
    }
    this.setErrorsDefault();
    if(this.newUser.password.length < 8) {
      this.errors.password = "Jelszónak minimum 8 karakter hosszúnak kell lennie";
      this.errors.passwordError = true;
      return;
    }
    this.setErrorsDefault();
    if(this.newUser.password_confirmation !== this.newUser.password) {
      this.errors.password_confirmation = "A jelszó nem egyezik";
      this.errors.password_confirmationError = true;
      return;
    }
    this.setErrorsDefault();
    
  }

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
    <Container>
      <Stack>
        <h1>Regisztráció</h1>
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
            <Stack direction={{sx:"column", sm:"row"}} justifyContent={"end"}>
              <Button type="submit" variant="contained" >Regisztrálok</Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}