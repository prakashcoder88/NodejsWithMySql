const mysql = require("mysql");
require("dotenv").config();

const { USER, PASSWORD, DATABASE } = process.env;

const connection = mysql.createConnection({
  host: "localhost",
  user: USER,
  password: PASSWORD,
  database: DATABASE
});

connection.connect((err) => {
  if (err) {
    console.error("Connection failed: " + err.message);
  } else {
    console.log("Successfully connected to the database");
  }
});

module.exports = connection;




