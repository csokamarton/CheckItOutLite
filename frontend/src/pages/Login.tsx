import React, { Component, FormEvent, ChangeEvent } from "react";
import { makeObservable, observable, action, computed } from "mobx";
import {  NavigateFunction } from "react-router-dom";
import "./css/Login.css";
import ViewComponent from "../interfaces/ViewComponent";
import { Box, Heading, Input, Button, Text, Link } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@mui/material";
import GlobalEntities from "../store/GlobalEntities";

export default class Login implements ViewComponent {
    formData = {
        email: "",
        password: "",
    };

    errors: { [key: string]: string } = {};

    constructor(public navigate: NavigateFunction) {
        makeObservable(this, {
            formData: observable,
            errors: observable,
            handleChange: action,
            validateForm: action,
            isValidForm: computed,
            handleSubmit: action
        });
    }

    @action handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.formData[e.target.name as keyof typeof this.formData] = e.target.value;
    };

    @computed get isValidForm() {
        return Object.keys(this.errors).length === 0;
    }

    @action validateForm = () => {
      const newErrors: { [key: string]: string } = {};
        if (!this.formData.email.includes("@")) newErrors.email = "Érvényes e-mail szükséges!";
        if (this.formData.password.length < 6) newErrors.password = "A jelszónak legalább 6 karakterből kell állnia!";
        
        this.errors = newErrors;

        return Object.keys(this.errors).length === 0;
    }

    @action handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        this.validateForm();

        if (this.validateForm()) {
            await GlobalEntities.login(this.formData.email, this.formData.password);
            alert("Sikeres bejelentkezés!");
            this.navigate("/home");
        }
    };

    View = () => (
<Box
      maxWidth="400px"
      margin="0 auto"
      padding="2rem"
      backgroundColor="#242424"
      color="rgba(255, 255, 255, 0.87)"
      borderRadius="8px"
      fontFamily="Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"
    >
      <Heading as="h1" fontSize="3.2em" lineHeight="1.1" marginBottom="1rem">
        Bejelentkezés
      </Heading>
      <form onSubmit={this.handleSubmit}>
        <FormControl sx={{marginBottom:"1rem"}}>
          <FormLabel>E-mail</FormLabel>
          <Input
            type="email"
            name="email"
            onChange={this.handleChange}
            backgroundColor="#1a1a1a"
            color="rgba(255, 255, 255, 0.87)"
            border="1px solid transparent"
            borderRadius="8px"
            padding="0.6em 1.2em"
            fontSize="1em"
            fontFamily="inherit"
            _hover={{
              borderColor: '#646cff',
            }}
          />
        </FormControl>
        <FormControl sx={{marginBottom:"1rem"}}>
          <FormLabel>Jelszó</FormLabel>
          <Input
            type="password"
            name="password"
            onChange={this.handleChange}
            backgroundColor="#1a1a1a"
            color="rgba(255, 255, 255, 0.87)"
            border="1px solid transparent"
            borderRadius="8px"
            padding="0.6em 1.2em"
            fontSize="1em"
            fontFamily="inherit"
            _hover={{
              borderColor: '#646cff',
            }}
          />
        </FormControl>
        <Button
          type="submit"
          backgroundColor="#1a1a1a"
          color="rgba(255, 255, 255, 0.87)"
          border="1px solid transparent"
          borderRadius="8px"
          padding="0.6em 1.2em"
          fontSize="1em"
          fontFamily="inherit"
          cursor="pointer"
          _hover={{
            borderColor: '#646cff',
          }}
        >
          Bejelentkezés
        </Button>
      </form>
      <Text marginTop="1rem">
        Még nincs fiókod?{' '}
        <Link
          onClick={() => this.navigate('/register')}
          color="white"
          textDecoration="none"
          padding="0.5rem"
          backgroundColor="#007bff"
          borderRadius="10px"
          cursor="pointer"
          _hover={{
            color: '#535bf2',
          }}
        >
          Regisztrálj itt
        </Link>
      </Text>
    </Box>
    );
}