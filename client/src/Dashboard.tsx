import type { User } from "./api.ts";

import { useContext, useEffect, useState } from "react";

import { getUsers, changeUserType } from "./api.ts";
import { UserContext } from "./App.tsx";
import { setTitle } from "./helpers.ts";
import { FormControl, MenuItem, Paper, Select, Table, TableBody, TableCell,
         TableContainer, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";

function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

function UserManagement() {
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(0);
  const [users, setUsers] = useState([] as Array<User>);
  useEffect(() => {
    getUsers(page * 10).then(({ rows: numRows, data }) => {
      setRows(numRows);
      setUsers(data);
    });
  }, [page]);

  return (
    <>
      <h2>Manage users</h2>
      <TableContainer component={Paper}>
        <Table stickyHeader>
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
                  {u.id === user.id ? capitalize(u.type) : (
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
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={5}
                rowsPerPageOptions={[10]}
                rowsPerPage={10}
                count={rows}
                page={page}
                onPageChange={(e, newPage) => { setPage(newPage); }}
              />
            </TableRow>
          </TableFooter>
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
      Welcome back, {[user.name?.first, user.name?.last].join(" ")}.
      {user.type === "admin" && <UserManagement />}
    </article>
  );
}
