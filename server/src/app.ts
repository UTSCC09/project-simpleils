import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
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
  host: "localhost",
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});
app.use(
  session({
    secret: "placeholder",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax"
    }
  })
);

if (process.env.NODE_ENV === "dev") {
  app.use(cors({ origin: "http://localhost:5173" }));
} else if (process.env.NODE_ENV === "prod") {
  app.use(express.static(path.join(import.meta.dirname, "../../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(import.meta.dirname, "../../client/dist/index.html"));
  });
}

// Authentication routes
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  if (username === undefined || password === undefined) {
    res.status(400).end();
    return;
  }

  await db.none("INSERT INTO users VALUES (DEFAULT, 'user', $1, $1, $1, $2)",
                [username, password]);
});
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === undefined || password === undefined) {
    res.status(400).end();
    return;
  }

  try {
    await db.one("SELECT * FROM users WHERE first_name=$1 AND password=$2",
                 [username, password]);
  } catch (e) {
    console.log("Login fail");
    res.end();
    return;
  }

  // Start a session
  req.session.user = username;
  res.end();
});

app.listen(PORT, () => {
  console.log("SimpleILS backend listening on port", PORT);
  console.log("Running server in mode:", process.env.NODE_ENV);
});

export default app;
