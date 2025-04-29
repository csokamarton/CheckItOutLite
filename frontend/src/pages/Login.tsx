import { FormEvent, ChangeEvent } from "react";
import { makeObservable, observable, action, computed } from "mobx";
import { NavigateFunction } from "react-router-dom";
import "./css/Login.css";
import ViewComponent from "../interfaces/ViewComponent";
import { Heading, Input, Text } from "@chakra-ui/react";
import { FormControl, FormLabel, Box, Typography, TextField, Button, Link, Paper } from "@mui/material";
import GlobalEntities from "../store/GlobalEntities";
import AlertBar from "../components/AlertBar";
import { observer } from "mobx-react-lite";

export default class Login implements ViewComponent {
  formData = {
    email: "",
    password: "",
  };

  errors: { [key: string]: string | boolean } = {};

  constructor(public navigate: NavigateFunction) {
    makeObservable(this, {
      formData: observable,
      errors: observable,
      handleChange: action,
      validateForm: action,
      handleSubmit: action,
    });
  }

  @computed get Alert() {
    return new AlertBar;
  }


  @action handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.formData[e.target.name as keyof typeof this.formData] = e.target.value;
    this.validateForm();
  };

  @computed get isValidForm() {
    return Object.keys(this.errors).length === 0;
  }

  @action validateForm = () => {
    const newErrors: { [key: string]: string | boolean } = {};
    if (!this.formData.email.includes("@")) { 
      newErrors.email = "Érvényes e-mail szükséges!";
      newErrors.emailError = true;
    }
    if (this.formData.password.length < 6) { 
      newErrors.password = "A jelszónak legalább 6 karakterből kell állnia!";
      newErrors.passwordError = true;
    }

    this.errors = newErrors;

    return Object.keys(this.errors).length === 0;
  }

  @action handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (this.validateForm()) {
      const resp = await GlobalEntities.login(this.formData.email, this.formData.password);
      if (resp.code == 1) {
        this.Alert.toggleAlert(true, resp.message, "success");
        setTimeout(() => {this.navigate("/home");}, 2500);
      }
      else{
        this.Alert.toggleAlert(true, resp.message, "error");
      }
      
    }
  };

  View = observer(() => (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: 4,
        borderRadius: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        backgroundColor: "background.paper",
        marginTop: "4rem"
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Bejelentkezés
      </Typography>
      <form onSubmit={this.handleSubmit} noValidate>
        <TextField
          fullWidth
          margin="normal"
          label="E-mail"
          name="email"
          type="email"
          onChange={this.handleChange}
          error={this.errors.emailError as boolean}
          helperText={this.errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Jelszó"
          name="password"
          type="password"
          onChange={this.handleChange}
          error={this.errors.passwordError as boolean}
          helperText={this.errors.password}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            textTransform: 'none',
            borderRadius: 1,
            '&:hover': { borderColor: '#646cff' }
          }}
        >
          Bejelentkezés
        </Button>
      </form>
      <Typography sx={{ mt: 2 }}>
        Még nincs fiókod?{' '}
        <Link
          onClick={() => this.navigate('/register')}
        >
          <Button
            variant="contained"
            sx={{
              color: '#fff',
              p: 1,
              borderRadius: 1,
              textDecoration: 'none',
              '&:hover': { color: '#535bf2' }
            }}>
            Regisztrálj itt
          </Button>
        </Link>
      </Typography>
      {<this.Alert.View />}
    </Box>
    
  ));
}