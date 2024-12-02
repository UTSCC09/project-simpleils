import type { User } from "./api.ts";

import { useContext, useEffect } from "react";

import { UserContext } from "./App.tsx";
import { setTitle } from "./helpers.ts";
import { Paper, Table, TableBody, TableContainer, TableCell, TableHead, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Records() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.loggedIn)
      navigate("/login");
  }, []);
  setTitle("Records");

  return (
    <article className="fixed-width">
      <h1>Book records</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Year</TableCell>
            </TableRow>
          </TableHead>
          <TableBody />
        </Table>
      </TableContainer>
    </article>
  );
}
