const bcrypt = require("bcrypt");
// const { model } = require("mongoose");
// const EmpRegister = require("../models/User");
// const adminuser = require("../models/Admin");
const responsemessage = require("../utils/ResponseMessage.json");
const connection = require("../config/Db.config");
const { StatusCodes } = require("http-status-codes");

async function passwordencrypt(password) {
  let salt = await bcrypt.genSalt(10);
  let passwordHash = bcrypt.hash(password, salt);
  return passwordHash;
}

function validatePassword(password) {
  const pattern = 
  // /^[^\s]{6,10}$/;
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$&%])(?!.*\s).{6,15}$/;
  return pattern.test(password);
}
function generateOTP(){
  return Math.floor(1000 + Math.random() * 9000);
}


const VerifyOTP = async (req, res) => {

  try {
    let { email, otp } = req.body;

    let selectQuery = 'SELECT * FROM studentdata WHERE email = ?';
    // let selectQuery1 = 'SELECT * FROM admindata WHERE email = ?';
    
    connection.query(selectQuery, [email], async (Error,userRows) =>{

      if (userRows.length === 0) {
        return res.status(404).json({
          status: StatusCodes.NOT_FOUND,
          message: responsemessage.NOTFOUND,
        });
      } else {
        const user = userRows[0];
     
        if (otp !== user.otp) {
          return res.status(400).json({
            statust: StatusCodes.BAD_REQUEST,
            message: responsemessage.OTPNOTMATCH,
          });
        } else if (
          user.otpExpire  <
            new Date().toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })
        ) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responsemessage.OTPEXPIRED,
          });
        } else {
          // connection.query(
          //   "UPDATE admindata SET  otp = NULL, WHERE email = ?",
          //   [otp]
          // );
          return res.status(200).json({
            status: StatusCodes.OK,
            message: responsemessage.OTPVIRIFY,
          });
        }
      }
    })  
    
  } catch (error) {
    // console.log("Error verifying OTP:", error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

const AdminVerifyOTP = async (req, res) => {

  try {
    let { email, otp } = req.body;
    let selectQuery = 'SELECT * FROM admindata WHERE email = ?';
    // let selectQuery1 = 'SELECT * FROM admindata WHERE email = ?';
    
    connection.query(selectQuery, [email], async (Error,userRows) =>{
    
      if (userRows.length === 0) {
        return res.status(404).json({
          status: StatusCodes.NOT_FOUND,
          message: responsemessage.NOTFOUND,
        });
      } else {
        const user = userRows[0];
       
        if (otp !== user.otp) {
          return res.status(400).json({
            statust: StatusCodes.BAD_REQUEST,
            message: responsemessage.OTPNOTMATCH,
          });
        } else if (
          user.otpExpire  <
            new Date().toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })
        ) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responsemessage.OTPEXPIRED,
          });
        } else {
          return res.status(200).json({
            status: StatusCodes.OK,
            message: responsemessage.OTPVIRIFY,
          });
        }
      }
    })  
    
  } catch (error) {
    // console.log("Error verifying OTP:", error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = { passwordencrypt, generateOTP,AdminVerifyOTP, VerifyOTP,validatePassword };
