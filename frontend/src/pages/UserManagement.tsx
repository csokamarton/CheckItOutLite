import React, { ChangeEvent } from "react";
import { makeObservable, observable, action } from "mobx";
import { observer } from "mobx-react-lite";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { Edit, Delete, Save, Cancel, ThirtyFpsRounded } from "@mui/icons-material";
import ViewComponent from "../interfaces/ViewComponent";
import { NavigateFunction } from "react-router-dom";
import GlobalEntities from "../store/GlobalEntities";

export default class UserManagement implements ViewComponent {
  @observable accessor editingId: number | null = null;
  @observable accessor editedUser: Partial<User> = {};
  public oldEmail = "";

  public errors = {
    name: "",
    nameError: false,
    email: "",
    emailError: false,
  }

  constructor(public navigate: NavigateFunction) {
    makeObservable(this, {
      handleChange: action,
      errors: observable
    });
  }

  @action handleEdit(user: User) {
    this.editingId = user.id ?? null;
    this.editedUser = { ...user };
    this.oldEmail = user.email as string;
  }


  @action handleCancel() {
    this.editingId = null;
    this.editedUser = {};
  }


  @action handleChange = async (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (!name) return;
    this.editedUser = { ...this.editedUser, [name]: value as string };
    await this.validateForm();
  };

  @action async handleSave() {
    if (!this.editedUser.id) return;

    try {

      await GlobalEntities.updateUserById(
        this.editedUser.id,
        this.editedUser.name ?? "",
        this.editedUser.email ?? "",
        this.editedUser.role ?? ""
      );

      this.editingId = null;
      this.editedUser = {};
      await GlobalEntities.fetchUsers();
    } catch (error) {
      console.error("Mentés sikertelen:", error);
    }
  }

  @action async handleDelete(id: number) {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?")) return;

    try {
      await GlobalEntities.deleteUser(id);
      await GlobalEntities.fetchUsers();
    } catch (error) {
      console.error("Törlés sikertelen:", error);
    }
  }

  @action setErrorsDefault = () => {
    this.errors = {
      name: "",
      nameError: false,
      email: "",
      emailError: false
    }
  }


  @action validateForm = async () => {
    let emails = await GlobalEntities.getUsedEmailAdmin();
    emails = emails.filter((e: string) => e != this.oldEmail);
    
    switch (true) {
      case this.editedUser.name === "":
        this.setErrorsDefault();
        this.errors.name = "Név megadása kötelező";
        this.errors.nameError = true;
        return;

      case this.editedUser.email === "":
        this.setErrorsDefault();
        this.errors.email = "E-mail cím megadása kötelező";
        this.errors.emailError = true;
        return;
      case !(this.oldEmail as string).includes("@"):
        this.setErrorsDefault();
        this.errors.email = "Valós E-mail cím megadása kötelező";
        this.errors.emailError = true;
        return;

      case emails.includes(this.editedUser.email as string):
        this.setErrorsDefault();
        this.errors.email = "Ez az e-mail cím már foglalt";
        this.errors.emailError = true;
        return;
      default:
        this.setErrorsDefault();
        break;
    }
  }


  View = observer(() => (
    <Container>
      <h2>Felhasználók kezelése</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Név</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Szerepkör</TableCell>
            <TableCell>Műveletek</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {GlobalEntities.users.map((user) => (
            <TableRow key={user.id}>
              <TableCell
              >
                {this.editingId === user.id ? (
                  <TextField
                    name="name"
                    value={this.editedUser.name || ""}
                    onChange={this.handleChange}
                    size="small"
                    error={this.errors.nameError}
                    helperText={this.errors.name}
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell>
                {this.editingId === user.id ? (
                  <TextField
                    name="email"
                    value={this.editedUser.email || ""}
                    onChange={this.handleChange}
                    size="small"
                    error={this.errors.emailError}
                    helperText={this.errors.email}
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                {this.editingId === user.id ? (
                  <Select
                    name="role"
                    value={this.editedUser.role || "user"}
                    onChange={this.handleChange}
                    size="small"
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                ) : (
                  user.role
                )}
              </TableCell>
              <TableCell>
                {this.editingId === user.id ? (
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => this.handleSave()}>
                      <Save />
                    </IconButton>
                    <IconButton onClick={() => this.handleCancel()}>
                      <Cancel />
                    </IconButton>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => this.handleEdit(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => this.handleDelete(user.id as number)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  ));
}