const express = require("express");
const authMiddlewere = require("../middlewere/userAuth");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login", { message: "" });
});

router.get("/register", (req, res) => {
  res.render("register", { message: "" });
});

router.get("/profile", authMiddlewere, (req, res) => {
  res.render("profile", { name: req.user.name });
});

router.get("/logout", (req, res) => {
  res.cookie("jwt", "");
  res.redirect("/");
});

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
