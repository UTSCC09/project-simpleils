import type { Request, Response, NextFunction } from "express";
import type { TokenPayload } from "google-auth-library";

import argon2 from "argon2";
import pgSimple from "connect-pg-simple";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session, { SessionOptions } from "express-session";
import { OAuth2Client } from "google-auth-library";
import path from "path";
import pgPromise from "pg-promise";

interface User {
  id: string;
  type: "user" | "staff" | "admin";
  name: { first: string; last: string };
  email: string;
}

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

dotenv.config({ path: path.join(import.meta.dirname, "../../.env") });

const PORT = 3000;

const app = express();
const pgp = pgPromise();
const db = pgp({
  host: process.env.NODE_ENV === "dev" ? "localhost" : "db",
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});
const { QueryResultError } = pgp.errors;
const PGSession = pgSimple(session);
const client = new OAuth2Client();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sess: SessionOptions = {
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "strict"
  },
  store: new PGSession({
    pgPromise: db,
    createTableIfMissing: true
  })
};

if (process.env.NODE_ENV === "dev") {
  app.use((req, res, next) => {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
  });
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));
} else {
  app.set("trust proxy", true);
  sess.cookie!.secure = true;
}
app.use(session(sess));

function requirePerms(perms: "user" | "staff" | "admin") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user === undefined) {
      res.status(401).json({ error: "You must log in to perform that action." });
      return;
    }

    const { type } = req.session.user;
    if (type === "admin" || type === "staff" && perms !== "admin"
      || type === "user" && perms === "user")
      next();
    else
      res.status(403).json({ error: "You have insufficient permissions to perform that action." });
  };
}

// Authentication routes
app.post("/signup", async (req, res) => {
  const { first, last, email, password } = req.body;
  if (first === undefined || last === undefined || email === undefined
    || password === undefined) {
    res.status(400).json({ error: "One or more required fields are missing." });
    return;
  }

  try {
    const hash = await argon2.hash(password);
    await db.none("INSERT INTO users VALUES (DEFAULT, 'user', $1, $2, $3, $4)",
                  [first, last, email, hash]);
    res.json({ ok: true });
  } catch (e) {
    if (e instanceof AggregateError) {
      console.error(e);
      res.status(500).json({ error: "A problem occurred." });
    } else {
      res.status(409).json({ error: "Email already exists." });
    }
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === undefined || password === undefined) {
    res.status(400).json({ error: "One or more required fields are missing." });
    return;
  }

  try {
    const q = await db.one("SELECT * FROM users WHERE email = $1", email);
    if (await argon2.verify(q.password, password)) {
      // Start a session
      const user: User = {
        id: q.id,
        type: q.type,
        name: { first: q.first_name, last: q.last_name },
        email: q.email
      };
      req.session.user = user;
      res.json(user);
    } else {
      console.log("Failed login attempt for", email, "from", req.ip);
      res.status(401).json({ error: "Email or password is incorrect." });
    }
  } catch (e) {
    if (e instanceof QueryResultError) {
      console.log("Failed login attempt for", email, "from", req.ip);
      res.status(401).json({ error: "Email or password is incorrect." });
      return;
    }
    console.error(e);
    res.status(500).json({ error: "A problem occurred." });
  }
});
app.post("/login/google", async (req, res) => {
  const { credential, clientId } = req.body.credential;
  let payload: TokenPayload;

  // Verify token
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId
    });
    payload = ticket.getPayload()!;
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Bad OAuth token." });
    return;
  }

  const { sub, email, given_name: first, family_name: last } = payload;

  // Try login
  try {
    const q = await db.oneOrNone(
      `SELECT users.id, type, first_name, last_name, email
           FROM users JOIN google ON users.id = google.id
           WHERE sub = $1`,
      sub
    );
    if (q !== null) {
      // Start a session
      const user: User = {
        id: q.id,
        type: q.type,
        name: { first: q.first_name, last: q.last_name },
        email: q.email
      };
      req.session.user = user;
      res.json(user);
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "A problem occurred." });
  }

  // Sign up instead
  try {
    const q = await db.one("INSERT INTO users VALUES (DEFAULT, 'user', $1, $2, $3, $4) RETURNING id",
                           [first, last, email, ""]);
    await db.none("INSERT INTO google VALUES ($1, $2)", [q.id, sub]);
    // Start a session
    const user: User = {
      id: q.id,
      type: q.type,
      name: { first: q.first_name, last: q.last_name },
      email: q.email
    };
    req.session.user = user;
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "A problem occurred." });
  }
});
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).json({ error: "A problem occurred." });
      return;
    }
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

// Data routes
app.get("/users", requirePerms("staff"), async (req, res) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    if (skip < 0) {
      res.status(400).json({ error: "skip should not be negative." });
      return;
    }

    const q1 = await db.one("SELECT COUNT(*) FROM users");
    const q2 = await db.manyOrNone(
      `SELECT id, type, first_name, last_name, email FROM users
           ORDER BY last_name OFFSET $1 LIMIT 10`,
      skip
    );
    res.json({ rows: parseInt(q1.count), data: q2 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "A problem occurred." });
  }
});
app.get("/authors", async (req, res) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    if (skip < 0) {
      res.status(400).json({ error: "skip should not be negative." });
      return;
    }

    const q1 = await db.one("SELECT COUNT(*) FROM authors");
    const q2 = await db.manyOrNone(
      `SELECT id, first_name, last_name FROM authors
           ORDER BY last_name OFFSET $1 LIMIT 10`,
      skip
    );
    res.json({ rows: parseInt(q1.count), data: q2 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "A problem occurred." });
  }
});
app.get("/publishers", async (req, res) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    if (skip < 0) {
      res.status(400).json({ error: "skip should not be negative." });
      return;
    }

    const q1 = await db.one("SELECT COUNT(*) FROM publishers");
    const q2 = await db.manyOrNone("SELECT * FROM publishers ORDER BY name OFFSET $1 LIMIT 10",
                                   skip);
    res.json({ rows: parseInt(q1.count), data: q2 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "A problem occurred." });
  }
});
app.get("/books", async (req, res) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    if (skip < 0) {
      res.status(400).json({ error: "skip should not be negative." });
      return;
    }

    const q1 = await db.one("SELECT COUNT(*) FROM books");
    const q2 = await db.manyOrNone(
      `SELECT books.id, title, CONCAT(last_name, ', ', first_name) AS author,
           name AS publisher, year FROM books
           JOIN authors ON author = authors.id
           JOIN publishers ON publisher = publishers.id
           ORDER BY title OFFSET $1 LIMIT 10`,
      skip
    );
    res.json({ rows: parseInt(q1.count), data: q2 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "A problem occurred." });
  }
});
app.patch("/users/:id", requirePerms("admin"), async (req, res) => {
  if (!["user", "staff", "admin"].includes(req.body.type)) {
    res.status(400).json({ error: "Invalid account type specified." });
    return;
  }
  if (req.params.id === req.session.user?.id) {
    res.status(400).json({ error: "You may not modify your own account type." });
    return;
  }
  try {
    await db.none("UPDATE users SET type = $1 WHERE id = $2",
                  [req.body.type, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    if (e instanceof QueryResultError) {
      res.status(404).json({ error: "User ID does not exist." });
      return;
    }
    console.error(e);
    res.status(500).json({ error: "A problem occurred." });
  }
});

app.listen(PORT, () => {
  console.log("SimpleILS backend listening on port", PORT);
  console.log("Version:", process.env.TAG);
  console.log("Running server in mode:", process.env.NODE_ENV);
});

export default app;
