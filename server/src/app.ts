import cors from "cors";
import express from "express";
import path from "path";

const PORT = 3000;

const app = express();
app.use((req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

if (process.env.NODE_ENV === "dev") {
  app.use(cors({ origin: "http://localhost:5173" }));
} else if (process.env.NODE_ENV === "prod") {
  app.use(express.static(path.join(import.meta.dirname, "../../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(import.meta.dirname, "../../client/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log("SimpleILS backend listening on port", PORT);
  console.log("Running server in mode:", process.env.NODE_ENV);
});

export default app;
