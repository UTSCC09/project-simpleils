import type { User } from "./api.ts";

import { useContext, useEffect, useState } from "react";

import { getUsers, changeUserType } from "./api.ts";
import { UserContext } from "./App.tsx";
import { setTitle } from "./helpers.ts";
import { FormControl, MenuItem, Paper, Select, Table, TableBody, TableContainer,
         TableCell, TableHead, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";

function UserManagement() {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([] as Array<User>);
  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <>
      <h2>Manage users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Account type</TableCell>
              <TableCell>First name</TableCell>
              <TableCell>Last name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell>
                  {u.id}
                </TableCell>
                <TableCell>
                  {u.id === user.id ? u.type : (
                    <FormControl size="small">
                      <Select
                        defaultValue={u.type}
                        sx={{ fontSize: "1rem" }}
                        onChange={e => {
                          changeUserType(u.id, e.target.value);
                        }}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </TableCell>
                <TableCell>
                  {u.first_name}
                </TableCell>
                <TableCell>
                  {u.last_name}
                </TableCell>
                <TableCell>
                  {u.email}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.loggedIn)
      navigate("/login");
  }, []);
  setTitle("Dashboard");

  return (
    <article className="fixed-width">
      <h1>Dashboard</h1>
      {user.type === "admin" && <UserManagement />}
    </article>
  );
}
