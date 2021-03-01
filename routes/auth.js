const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { request } = require("express");

router.use(express.static(path.join(__dirname, "/../public")));

router.post("/register", async (req, res) => {
  const { name, email, password, password1 } = req.body;
  let hashPassword = await bcrypt.hash(password, 8);
  db.query("SELECT email FROM users WHERE email = ?", [email], (err, val) => {
    if (err) {
      console.log(err);
      return res.json({ err });
    }
    if (val.length) {
      return res.status(202).render("register", {
        message: "That Email has been Taken",
        isRegister: false,
      });
    }
    if (password !== password1) {
      return res.status(202).render("register", {
        message: "Password does not match",
        isRegister: false,
      });
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
        return res.render("register", {
          message: "User Registered",
          isRegister: true,
        });
      }
    );
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login", { message: "Fill all the Field" });
  }

  db.query(
    "SELECT * from users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.send(err);
      }
      if (
        result.length === 0 ||
        !(await bcrypt.compare(password, result[0].password))
      ) {
        return res.render("login", { message: "Email or Password Wrong" });
      }
      let userID = result[0].id;
      const token = jwt.sign({ id: userID }, process.env.JWT_SECREAT, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      const cookieOption = {
        expire: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60
        ),
        httpOnly: true,
      };
      console.log(token);
      res.cookie("jwt", token, cookieOption);
      res.status(200).redirect("/profile");
    }
  );
});

module.exports = router;
