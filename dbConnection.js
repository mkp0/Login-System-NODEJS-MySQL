const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST, //for server use ip address
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
});

module.exports = db;
