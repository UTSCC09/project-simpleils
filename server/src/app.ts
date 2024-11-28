import argon2 from "argon2";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session, { SessionOptions } from "express-session";
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const sess: SessionOptions = {
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "strict"
  }
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
      res.status(500).json({ error: "A problem occurred." });
      console.log(e);
    } else { res.status(409).json({ error: "Email already exists." }); }
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === undefined || password === undefined) {
    res.status(400).json({ error: "One or more required fields are missing." });
    return;
  }

  try {
    const q = await db.one("SELECT * FROM users WHERE email=$1", email);
    if (await argon2.verify(q.password, password)) {
      // Start a session
      req.session.user = email;
      res.json({ ok: true });
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
    res.status(500).json({ error: "A problem occurred." });
    console.log(e);
  }
});

app.listen(PORT, () => {
  console.log("SimpleILS backend listening on port", PORT);
  console.log("Version:", process.env.TAG);
  console.log("Running server in mode:", process.env.NODE_ENV);
});

export default app;
