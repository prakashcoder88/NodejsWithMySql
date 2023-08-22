const nodemailer = require("nodemailer");
const transpoter = require("../config/Email.config");
// require("../models/User")
// const connection = require("../config/Db.config");
// const {generateOTP } = require("../../services/CommonService");

async function sendEmail(email, OTP) {
  try {
    let mailOptions = {
      from: "demonodejs@outlook.com",
      to: email,
      subject: "Forgot password rest",
      text: `You forgot password rest code is: ${OTP}`,
    };

    let info = await transpoter.sendMail(mailOptions);
    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Cannot send email",
    };
  }
}

module.exports = sendEmail;

// async function sendEmail(email, OTP) {
//   console.log(email);
//   try {
//     let mailOptions = {
//       from: 'demonodejs@outlook.com',
//       to: email,
//       subject: 'Forgot password reset',
//       text: `You forgot password reset code is: ${OTP}`,
//     };

//     let [results] = await connection.query('SELECT * FROM empdata WHERE email = ?', [email]);
//     const user = results[0];
// console.log(email);
//     if (!user) {
//       return {
//         error: true,
//         message: responsemessage.USERNOTFOUND,
//       };
//     }

//     let info = await transpoter.sendMail(mailOptions);

//     return { error: false };
//   } catch (error) {
//     console.error('send-email-error', error);
//     return {
//       error: true,
//       message: 'Cannot send email',
//     };
//   }
// }

// module.exports= sendEmail;
