const mysql = require("mysql");
require("dotenv").config();

const { USER, PASSWORD, DATABASE } = process.env;

const connection = mysql.createPool({
  host: "localhost",
  user: USER,
  password: PASSWORD,
  database: DATABASE
});

connection.getConnection((err, conn) => {
  if (err) {
    console.error("Connection failed: " + err.message);
  } else {
    console.log("Successfully connected to the database");
    conn.release()
  }
});

module.exports = connection;




