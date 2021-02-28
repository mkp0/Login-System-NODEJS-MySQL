const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.use(express.static(path.join(__dirname, "/../public")));

router.post("/register", async (req, res) => {
  const { name, email, password, password1 } = req.body;
  let hashPassword = await bcrypt.hash(password, 8);
  console.log(hashPassword);
  db.query("SELECT email FROM users WHERE email = ?", [email], (err, val) => {
    if (err) {
      console.log(err);
      return res.json({ err });
    }
    if (val.length) {
      return res
        .status(202)
        .render("register", { message: "That Email has been Taken" });
    }
    if (password !== password1) {
      return res
        .status(202)
        .render("register", { message: "Password does not match" });
    }

    db.query(
      "INSERT INTO users SET ?",
      {
        name,
        email,
        password: hashPassword,
      },
      (err, val) => {
        if (err) {
          res.json({ err });
        }
        return res.render("register", { message: "User Registered" });
      }
    );
  });
});

module.exports = router;
