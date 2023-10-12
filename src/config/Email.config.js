const nodemailer = require("nodemailer");
// const connection = require("../config/Db.config");
// const Otp = require("./CommonService")
// require("../models/User")


// const {auth_email, auth_pass} = process.env;

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  // auth: {
  //   user: "d62af087dbbc5b",
  //   pass: "4c4688768fcd6f"
  // }
});


module.exports = transport

// // async function getEmailConfig() {
// // const {email} = req.body
// //   const [rows] = await connection.query('SELECT * FROM empdata WHERE id = ?', [1]); // Assuming you have one row of email config in the table
// //   connection.close();
// //   return rows[0];
// // }

// const transporter = nodemailer.createTransport({
//   service: "sandbox.smtp.mailtrap.io", // Update with the appropriate service if not using Mailtrap
//   auth: {
//     user: "d62af087dbbc5b", // Get these values from your database using getEmailConfig()
//     pass: "4c4688768fcd6f",
//   },
// });

// module.exports = transporter;