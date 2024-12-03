import type { Book } from "./api.ts";

import { useContext, useEffect, useState } from "react";

import { getBooks } from "./api.ts";
import { UserContext } from "./App.tsx";
import { setTitle } from "./helpers.ts";
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter,
         TableHead, TablePagination, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Catalogue() {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(0);
  const [books, setBooks] = useState([] as Array<Book>);
  useEffect(() => {
    getBooks(page * 10).then(({ rows: numRows, data }) => {
      setRows(numRows);
      setBooks(data);
    });
  }, [page]);
  setTitle("Catalogue");

  return (
    <article className="fixed-width">
      <h1>Catalogue</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Year</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map(b => (
              <TableRow key={b.id}>
                <TableCell>
                  {b.title}
                </TableCell>
                <TableCell>
                  {b.author}
                </TableCell>
                <TableCell>
                  {b.publisher}
                </TableCell>
                <TableCell>
                  {b.year}
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
    </article>
  );
}
