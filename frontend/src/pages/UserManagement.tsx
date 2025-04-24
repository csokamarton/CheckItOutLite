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

  constructor(public navigate: NavigateFunction) {
    makeObservable(this);
  }

  @action handleEdit(user: User) {
    this.editingId = user.id ?? null;
    this.editedUser = { ...user }; 
  }
  

  @action handleCancel() {
    this.editingId = null;
    this.editedUser = {};
  }
  

  handleChange = action(
    (
      e:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<{ name?: string; value: unknown }>
    ) => {
      const { name, value } = e.target;
      if (!name) return;
      this.editedUser = { ...this.editedUser, [name]: value as string };
    }
  );
  
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
              <TableCell>
                {this.editingId === user.id ? (
                  <TextField
                    name="name"
                    value={this.editedUser.name || ""}
                    onChange={this.handleChange}
                    size="small"
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
                    <IconButton onClick={() => this.handleDelete(user.id)}>
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