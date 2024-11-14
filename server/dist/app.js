import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import pgPromise from "pg-promise";
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
if (process.env.NODE_ENV === "dev") {
    app.use(cors({ origin: "http://localhost:5173" }));
}
else if (process.env.NODE_ENV === "prod") {
    app.use(express.static(path.join(import.meta.dirname, "../../client/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(import.meta.dirname, "../../client/dist/index.html"));
    });
}
// Authentication routes
app.post("/signup", (req, res) => {
    const { username, passwd } = req.body;
    if (username === undefined || passwd === undefined) {
        res.status(400).end();
        return;
    }
    // userDb.findOne({ _id: username }, async (err, user) => {
    //   if (err) {
    //     res.status(500).end(err);
    //     return;
    //   }
    //   if (user) {
    //     res.status(409).end("Username already exists");
    //     return;
    //   }
    //   // Generate new hash
    //   const hash = await bcrypt.hash(passwd, 10);
    //   userDb.insert({ _id: username, passwd: hash }, err => {
    //     if (err)
    //       res.status(500).end(err);
    //   });
    //   // Start a session
    //   req.session.user = username;
    //   res.json({});
    // });
});
// app.post("/login", (req, res) => {
//   const { username, passwd } = req.body;
//   if (username === undefined || passwd === undefined) {
//     res.status(400).end();
//     return;
//   }
//   userDb.findOne({ _id: username }, async (err, user) => {
//     if (err) {
//       res.status(500).end(err);
//       return;
//     }
//     if (!user) {
//       res.status(401).end("Incorrect username or password");
//       return;
//     }
//     const match = await bcrypt.compare(passwd, user.passwd);
//     if (!match) {
//       res.status(401).end("Incorrect username or password");
//       return;
//     }
//     // Start a session
//     req.session.user = username;
//     res.json({});
//   });
// });
app.listen(PORT, () => {
    console.log("SimpleILS backend listening on port", PORT);
    console.log("Running server in mode:", process.env.NODE_ENV);
});
export default app;
