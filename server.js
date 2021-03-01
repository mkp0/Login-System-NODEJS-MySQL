const express = require("express");
const dotenv = require("dotenv");
const pagesRoute = require("./routes/pages");
const authRoute = require("./routes/auth");
const bodyParser = require("body-parser");
const db = require("./dbConnection");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./.env" });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("You are connected to mysql");
  }
});

app.use("/auth", authRoute);
app.use("/", pagesRoute);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
