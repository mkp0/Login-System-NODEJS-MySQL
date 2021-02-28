const express = require("express");

const router = express.Router();

router.use("/login", (req, res) => {
  res.render("login");
});

router.use("/register", (req, res) => {
  res.render("register", { message: "" });
});

router.use("/", (req, res) => {
  res.render("index");
});

module.exports = router;
