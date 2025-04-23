import React, { ChangeEvent, FormEvent, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import "./css/Register.css";
import ViewComponent from "../interfaces/ViewComponent";
import { observer } from "mobx-react-lite";
import { Box, Button, Container, FormControl, Stack, TextField } from "@mui/material";
import { action, makeObservable, observable } from "mobx";

const _Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.fullName) newErrors.fullName = "Név megadása kötelező!";
    if (!formData.email.includes("@")) newErrors.email = "Érvényes e-mail szükséges!";
    if (formData.password.length < 6) newErrors.password = "A jelszónak legalább 6 karakterből kell állnia!";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "A jelszavak nem egyeznek!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Sikeres regisztráció!");
      navigate("/");
    }
  };

  return (
    <div className="register-container">
      <h1>Regisztráció</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Név</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label>E-mail</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Jelszó</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Jelszó megerősítése</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        <button type="submit">Regisztráció</button>
      </form>
    </div>
  );
};




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
    
    console.log(this.newUser);
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