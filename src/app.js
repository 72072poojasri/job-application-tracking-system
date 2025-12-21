const express = require("express");

const app = express();
app.use(express.json());

app.post("/api/auth/register", (req, res) => {
  res.json({ message: "REGISTER WORKING FINAL" });
});

app.get("/", (req, res) => {
  res.send("ATS Backend Running");
});

module.exports = app;
