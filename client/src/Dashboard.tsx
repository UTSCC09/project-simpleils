import type { User } from "./api.ts";

import { useEffect, useState } from "react";

import { getUsers } from "./api.ts";
import { setTitle } from "./helpers.ts";
import { Paper, Table, TableBody, TableContainer, TableCell, TableHead, TableRow } from "@mui/material";

export default function Dashboard() {
  const [users, setUsers] = useState([] as Array<User>);
  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  setTitle("Dashboard");
  return (
    <article className="fixed-width">
      <h1>Dashboard</h1>
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
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.id}
                </TableCell>
                <TableCell>
                  {user.type}
                </TableCell>
                <TableCell>
                  {user.first_name}
                </TableCell>
                <TableCell>
                  {user.last_name}
                </TableCell>
                <TableCell>
                  {user.email}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </article>
  );
}
