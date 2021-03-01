const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../dbConnection");

dotenv.config({ path: "../" });

const middlewere = async (req, res, next) => {
  console.log(req.cookies);
  jwt.verify(req.cookies.jwt, process.env.JWT_SECREAT, (err, verifiedJwt) => {
    if (err) {
      return res.redirect("/");
    } else {
      db.query(
        "SELECT * from users WHERE id = ?",
        [verifiedJwt.id],
        async (err, result) => {
          if (err) {
            return res.send(err);
          }
          if (result.length === 0) {
            return res.render("login", { message: "User not found" });
          }
          result[0].password = undefined;
          req.user = result[0];
          next();
        }
      );
    }
  });
  //   console.log(user);
};

module.exports = middlewere;
