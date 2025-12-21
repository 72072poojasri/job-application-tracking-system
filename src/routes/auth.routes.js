const express = require("express");
const router = express.Router();

// test routes
router.get("/ping", (req, res) => {
  res.send("PING FROM ROUTER");
});

router.post("/register", (req, res) => {
  res.json({ message: "REGISTER ROUTE HIT" });
});

module.exports = router;
