import React, { ChangeEvent, FormEvent, useState } from 'react';
import './css/taskRecording.css';
import ViewComponent from '../interfaces/ViewComponent';
import { FormControl, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { Box, Button, Card, For, Input, Stack, VStack } from '@chakra-ui/react';
import { action, computed, makeObservable, observable, toJS } from 'mobx';
import { NavigateFunction } from 'react-router-dom';
import GlobalEntities from '../store/GlobalEntities';
import { observer } from 'mobx-react-lite';


export default class TaskRecording implements ViewComponent {
  category: Category = {
    id: undefined,
    name: ""
  };

  formData: {
    title: string,
    description: string,
    due_date: Date | string,
    category_id: number,
    priority: number,
    status: string,
    user_id: number
  } = {
      title: "",
      description: "",
      due_date: new Date(Date.now()),
      category_id: 0,
      priority: 0,
      status: "új",
      user_id: (GlobalEntities.user.id as number)
    }
  errors: { [key: string]: string } = {};

  constructor(public navigate: NavigateFunction) {
    makeObservable(this, {
      category: observable,
      handleSelectChange: action,
      validateForm: action,
      submitForm: action,
      errors: observable,
      formData: observable
    });
  }

  @action validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (this.formData.title.length > 50) {
      newErrors.title = "A feladat neve nem lehethosszabb 50 karakternél!";
    }
    if (this.formData.description.length > 255) {
      newErrors.title = "A feladat leírása nem lehethosszabb 255 karakternél!";
    }
    if (this.formData.due_date <= new Date(Date.now())) {
      newErrors.due_date = "A feladat határideje nem lehet korábban mint holnap!";
    }
    this.errors = newErrors;

    return Object.keys(this.errors).length === 0;
  }

  @action handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "category_id") {
      this.formData.category_id = Number(value);
    }
    if (name === "priority") {
      this.formData.priority = Number(value);
    }
    if (name === "due_date") {
      this.formData.due_date = new Date(value)
    }
    if (name === "title") this.formData.title = value;
    if (name === "description") this.formData.description = value;
  };

  @action submitForm = async (event: FormEvent) => {
    event.preventDefault();
    this.errors = {}
    this.validateForm();
    if (this.validateForm()) {
      this.formData.due_date = (this.formData.due_date as Date).toISOString().slice(0, 19).replace("T", " ")
      const resp = await GlobalEntities.createTask(this.formData);
      if (resp.status === 201) {
        alert("Sikeresen létrehozva");
        this.navigate("home")
      }
    }
  }

  @action handleSelectChange = (event: SelectChangeEvent) => {
    this.category.id = Number(event.target.value);
    this.category.name = GlobalEntities.categories.find((element) => element.id === this.category.id)?.name;

    this.formData.category_id = Number(event.target.value);
  }

  @computed get categoryId() {
    return this.category.id === undefined ? "" : this.category.id.toString();
  }

  @computed get errorTitle() {
    return this.errors.title === undefined ? false : true;
  }

  View = observer(() => (
    <Stack maxWidth={720} padding={20} margin={"auto"}>
      <Card.Root variant='outline' >
        <Card.Header>
          <Card.Title>Feladat Hozzáadás</Card.Title>
          <Card.Description>Töltsd ki az űrlapot a feladat felvételéhez</Card.Description>
        </Card.Header>
        <Card.Body>
          <form onSubmit={this.submitForm}>
            <VStack>
              <FormControl fullWidth>
                <TextField
                  label='Feladat neve'
                  type='text'
                  name='title'
                  id='title'
                  fullWidth
                  required
                  error={this.errorTitle}
                  helperText={this.errors.title}
                  onChange={this.handleChange}
                />
              </ FormControl>
              <FormControl fullWidth>
                <TextField
                  label='Leírás'
                  type='text'
                  name='description'
                  id='descreption'
                  fullWidth
                  required
                  onChange={this.handleChange}
                />
              </ FormControl>
              <FormControl fullWidth>
                <TextField
                  label='Határidő'
                  type='datetime-local'
                  name='due_date'
                  id='due_date'
                  slotProps={
                    { inputLabel: { shrink: true } }
                  }
                  fullWidth
                  required
                  onChange={this.handleChange}
                />
              </ FormControl>
              <FormControl fullWidth>
                <InputLabel id="categoryLabel">Kategória</InputLabel>
                <Select
                  fullWidth
                  labelId='categoryLabel'
                  label='Kategória'
                  id='category'
                  value={this.categoryId}
                  onChange={this.handleSelectChange}
                  required
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {toJS(GlobalEntities.categories).map((category: Category) => {
                    return (
                      <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label="Prioritás"
                  type='number'
                  id='priority'
                  name='priority'
                  slotProps={
                    { htmlInput: { 'max': 10, 'min': 0 } }
                  }
                  required
                  onChange={this.handleChange}
                />
              </FormControl>
            </VStack>
            <Box display='flex' justifyContent='end'>
              <Button type='submit' marginTop={5}>Felvétel</Button>
            </Box>

          </form>
        </Card.Body>
      </Card.Root>

    </Stack>
  ));
}
