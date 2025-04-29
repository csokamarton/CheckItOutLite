import React, { ChangeEvent, FormEvent, useState } from 'react';
import './css/taskRecording.css';
import ViewComponent from '../interfaces/ViewComponent';
import { FormControl, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { Box, Button, Card, For, Input, Stack, VStack } from '@chakra-ui/react';
import { action, computed, makeObservable, observable, toJS } from 'mobx';
import { NavigateFunction } from 'react-router-dom';
import GlobalEntities from '../store/GlobalEntities';
import { observer } from 'mobx-react-lite';
import AlertBar from '../components/AlertBar';


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

  public errors = {
    title: "",
    titleError: false,
    description: "",
    descriptionError: false,
    due_date: "",
    due_dateError: false,
    priority: "",
    priotityError: false,
    category: "",
    categoryError: false
  };

  public today;
  constructor(public navigate: NavigateFunction) {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    makeObservable(this, {
      category: observable,
      errors: observable,
      formData: observable,
      handleSelectChange: action,
      validateForm: action,
      submitForm: action,
    });
  }

  @action validateForm = () => {
    switch (true) {
      case this.formData.title == "":
        this.errors.titleError = true;
        this.errors.title = "Feladat név megadása kötelező";
        return;
  
      case this.formData.title.length > 50:
        this.setErrorsDefault();
        this.errors.titleError = true;
        this.errors.title = "Feladat név nem lehet hosszabb 50 karakternél";
        return;
  
      case this.formData.description.length > 255:
        this.setErrorsDefault();
        this.errors.descriptionError = true;
        this.errors.description = "A leírás nem lehet hosszabb 255 karakternél";
        return;
  
      case this.formData.due_date < this.today:
        this.setErrorsDefault();
        this.errors.due_dateError = true;
        this.errors.due_date = "Feladat határideje nem lehet korábban mint ma";
        return;
  
      case this.formData.priority < 0 || this.formData.priority > 10:
        this.setErrorsDefault();
        this.errors.priotityError = true;
        this.errors.priority = "Prioritás 0 és 10 közzé kell essen";
        return;
  
      case this.formData.category_id == 0:
        this.setErrorsDefault();
        this.errors.categoryError = true;
        this.errors.category = "Kategória választása kötelező";
        return;
  
      default:
        this.setErrorsDefault();
    }
  };
  

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

    this.validateForm();
  };

  @action submitForm = async (event: FormEvent) => {
    event.preventDefault();

    this.validateForm();
    if (true) {
      this.formData.due_date = (this.formData.due_date as Date).toISOString().slice(0, 19).replace("T", " ")
      const resp = await GlobalEntities.createTask(this.formData);
      if (resp.status === 201) {
        this.Alert.toggleAlert(true, "Sikeresen létrehozva", "success");
        setTimeout(() => {
          this.navigate("/home");
         }, 2500)
        
      }
    }
  }

  @action handleSelectChange = (event: SelectChangeEvent) => {
    this.category.id = Number(event.target.value);
    this.category.name = GlobalEntities.categories.find((element) => element.id === this.category.id)?.name;

    this.formData.category_id = Number(event.target.value);
    this.validateForm();
  }

  @computed get categoryId() {
    return this.category.id === undefined ? "" : this.category.id.toString();
  }

  @action setErrorsDefault = () => {
    this.errors = {
      title: "",
      titleError: false,
      description: "",
      descriptionError: false,
      due_date: "",
      due_dateError: false,
      priority: "",
      priotityError: false,
      category: "",
      categoryError: false
    };
  }

  @computed get Alert() {
      return new AlertBar;
   }

  View = observer(() => (
    <Stack maxWidth={720} padding={20} margin={"auto"}>
      <Card.Root variant='outline' >
        <Card.Header>
          <Card.Title>Feladat Hozzáadás</Card.Title>
          <Card.Description>Töltsd ki az űrlapot a feladat felvételéhez</Card.Description>
        </Card.Header>
        <Card.Body>
          <form onSubmit={this.submitForm} noValidate>
            <VStack>
              <FormControl fullWidth>
                <TextField
                  label='Feladat neve'
                  type='text'
                  name='title'
                  id='title'
                  fullWidth
                  error={this.errors.titleError}
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
                  error={this.errors.descriptionError}
                  helperText={this.errors.description}
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
                  error={this.errors.due_dateError}
                  helperText={this.errors.due_date}
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
                  error={this.errors.priotityError}
                  helperText={this.errors.priority}
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
    {
      < this.Alert.View/>
    }
    </Stack>
  ));
}
