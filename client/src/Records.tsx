import type { Author, Book, Publisher } from "./api.ts";

import { useContext, useEffect, useState } from "react";

import { UserContext } from "./App.tsx";
import { setTitle } from "./helpers.ts";
import { Button, Paper, Table, TableBody, TableCell, TableContainer,
         TableFooter, TableHead, TablePagination, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { deleteAuthor, deleteBook, deletePublisher, getAuthors, getBooks,
         getPublishers } from "./api.ts";

function AuthorRecords() {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(0);
  const [authors, setAuthors] = useState([] as Array<Author>);
  const navigate = useNavigate();
  useEffect(() => {
    getAuthors(page * 10).then(({ rows: numRows, data }) => {
      setRows(numRows);
      setAuthors(data);
    });
  }, [page]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>First name</TableCell>
            <TableCell>Last name</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {authors.map(a => (
            <TableRow key={a.id}>
              <TableCell>
                {a.id}
              </TableCell>
              <TableCell>
                {a.first_name}
              </TableCell>
              <TableCell>
                {a.last_name}
              </TableCell>
              <TableCell>
                <Button
                  color="error"
                  onClick={() => {
                    deleteAuthor(a.id);
                    navigate("/dashboard");
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={4}
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
  );
}

function PublisherRecords() {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(0);
  const [publishers, setPublishers] = useState([] as Array<Publisher>);
  const navigate = useNavigate();
  useEffect(() => {
    getPublishers(page * 10).then(({ rows: numRows, data }) => {
      setRows(numRows);
      setPublishers(data);
    });
  }, [page]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {publishers.map(p => (
            <TableRow key={p.id}>
              <TableCell>
                {p.id}
              </TableCell>
              <TableCell>
                {p.name}
              </TableCell>
              <TableCell>
                <Button
                  color="error"
                  onClick={() => {
                    deletePublisher(p.id);
                    navigate("/dashboard");
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={3}
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
  );
}

function BookRecords() {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(0);
  const [books, setBooks] = useState([] as Array<Book>);
  const navigate = useNavigate();
  useEffect(() => {
    getBooks(page * 10).then(({ rows: numRows, data }) => {
      setRows(numRows);
      setBooks(data);
    });
  }, [page]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Publisher</TableCell>
            <TableCell>Year</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map(b => (
            <TableRow key={b.id}>
              <TableCell>
                {b.id}
              </TableCell>
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
              <TableCell>
                <Button
                  color="error"
                  onClick={() => {
                    deleteBook(b.id);
                    navigate("/dashboard");
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={6}
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
  );
}

export default function Records() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.loggedIn)
      navigate("/login");
    else if (user.type === "user")
      navigate("/dashboard");
  }, []);
  setTitle("Records");

  return (
    <article className="fixed-width">
      <h1>Records</h1>
      <h2>Author records</h2>
      <AuthorRecords />
      <h2>Publisher records</h2>
      <PublisherRecords />
      <h2>Book records</h2>
      <BookRecords />
    </article>
  );
}
