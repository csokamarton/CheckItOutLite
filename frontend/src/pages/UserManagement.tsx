import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Button
} from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

const UserManagement: React.FC = observer(() => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data));
  }, []);

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditedUser({ ...user });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedUser({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSave = () => {
    if (!editedUser.id) return;
    axios.put(`/api/users/${editedUser.id}`, editedUser).then(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === editedUser.id ? { ...u, ...editedUser } as User : u))
      );
      setEditingId(null);
    });
  };

  const handleDelete = (id: number) => {
    axios.delete(`/api/users/${id}`).then(() => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    });
  };

  return (
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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {editingId === user.id ? (
                  <TextField
                    name="name"
                    value={editedUser.name || ""}
                    onChange={handleChange}
                    size="small"
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <TextField
                    name="email"
                    value={editedUser.email || ""}
                    onChange={handleChange}
                    size="small"
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <Select
                    name="role"
                    value={editedUser.role || "user"}
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
                {editingId === user.id ? (
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={handleSave}>
                      <Save />
                    </IconButton>
                    <IconButton onClick={handleCancel}>
                      <Cancel />
                    </IconButton>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleEdit(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user.id)}>
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
  );
});

export default UserManagement;
