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

declare module "express-session" {
  interface SessionData {
    user: string;
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
      req.session.user = q.id;
      res.json({
        id: q.id,
        type: q.type,
        name: { first: q.first_name, last: q.last_name },
        email: q.email
      });
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
           FROM users JOIN google ON users.id = google.id`
    );
    if (q !== null) {
      // Start a session
      req.session.user = q.id;
      res.json({
        id: q.id,
        type: q.type,
        name: { first: q.first_name, last: q.last_name },
        email: q.email
      });
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
app.get("/users", async (req, res) => {
  try {
    const q = await db.manyOrNone("SELECT id, type, first_name, last_name, email FROM users");
    res.json(q);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "A problem occurred." });
  }
});
app.patch("/users/:id", async (req, res) => {
  if (!["user", "staff", "admin"].includes(req.body.type)) {
    res.status(400).json({ error: "Invalid account type specified." });
    return;
  }
  if (req.params.id === req.session.user) {
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
