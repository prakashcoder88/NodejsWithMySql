const bcrypt = require("bcrypt");
require("mysql");
require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const responsemessage = require("../../utils/ResponseMessage.json");
const {
  passwordencrypt,
  generateOTP,
  validatePassword,
} = require("../../services/CommonService");
const sendEmail = require("../../services/EmailService");
const { generateJwt } = require("../../utils/jwt");
const { blockTokens } = require("../../middleware/auth");

const connection = require("../../config/Db.config");
const uploadFile = require("../../middleware/FileUpload");

exports.SignUp = async (req, res) => {
  let { StudentName, email, phone, password } = req.body;

  try {
    StudentName = StudentName.replace(/\s/g, "");
    username =
      StudentName.toLowerCase() + Math.floor(Math.random().toFixed(2) * 100);

    const checkQuery = "SELECT * FROM studentdata WHERE email = ? OR phone = ?";

    connection.query(checkQuery, [email, phone], async (error, results) => {
      let existemail = results.find(
        (studentdata) => studentdata.email === email
      );
      let existphone = results.find(
        (studentdata) => studentdata.phone === phone
      );

      if (existemail || existphone) {
        const message = existemail
          ? responsemessage.EMAILEXITS
          : responsemessage.phoneEXITS;

        res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message,
        });
      } else {
        if (!validatePassword(password)) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responsemessage.VALIDATEPASS,
          });
        } else {
          const hashPassword = await passwordencrypt(password);

          const insertQuery =
            "INSERT INTO studentdata (StudentName, username, email, phone, password) VALUES (?,?, ?, ?, ?)";

          connection.query(
            insertQuery,
            [StudentName, username, email, phone, hashPassword],
            (error, insertResults) => {
              if (error) {
                return res.status(400).json({
                  status: StatusCodes.BAD_REQUEST,
                  message: responsemessage.NOTCREATED,
                });
              } else {
                return res.status(201).json({
                  status: StatusCodes.CREATED,
                  message: responsemessage.CREATED,
                });
              }
            }
          );
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.SignIn = async (req, res) => {
  try {
    const { masterfield, password } = req.body;

    const selectdata =
      "SELECT * FROM studentdata WHERE email = ? OR username = ? OR phone = ?";
    connection.query(
      selectdata,
      [masterfield, masterfield, masterfield],
      async (err, results) => {
        if (err) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responsemessage.NOTFOUND,
          });
        } else if (!results || results.length === 0) {
          return res.status(404).json({
            status: StatusCodes.BAD_REQUEST,
            error: true,
            message: responsemessage.NOTFOUND,
          });
        } else {
          const userLogin = results[0];

          if (userLogin.isactive) {
            return res.status(401).json({
              status: StatusCodes.UNAUTHORIZED,
              message: responsemessage.UNAUTHORIZED,
            });
          } else {
            const isvalid = await bcrypt.compare(password, userLogin.password);

            if (!isvalid) {
              return res.status(400).json({
                status: StatusCodes.BAD_REQUEST,
                error: true,
                message: responsemessage.NOTMATCH,
              });
            } else {
              const { error, token } = await generateJwt(userLogin.id);
              if (error) {
                return res.status(400).json({
                  status: StatusCodes.BAD_REQUEST,
                  error: true,
                  message: responsemessage.TOKEN,
                });
              } else {
                return res.status(200).json({
                  status: StatusCodes.OK,
                  userLogin: userLogin.email,
                  phone: userLogin.phone,
                  success: true,
                  token: token,
                  message: responsemessage.SUCCESS,
                });
              }
            }
          }
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.studentFind = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (blockTokens.has(token)) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "User logged out.",
      });
    } else {
      const selectdata = "SELECT * FROM studentdata WHERE id = ?";
      connection.query(
        selectdata,
        [req.currentUser],
        async (error, results) => {
          if (error) {
            return res.status(400).json({
              status: StatusCodes.BAD_REQUEST,
              message: responsemessage.NOTFOUND,
            });
          } else {
            res.status(200).json({
              status: StatusCodes.OK,
              message: responsemessage.FOUNDUSER,
              results,
            });
          }
        }
      );
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.studentDelete = async (req, res) => {
  try {
    const userId = req.currentUser;

    const selectData = "SELECT * FROM studentdata WHERE id = ?";
    connection.query(selectData, [userId], (error, results) => {
      if (error) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: responsemessage.NOTFOUND,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          status: StatusCodes.NOT_FOUND,
          message: responsemessage.NOTFOUND,
        });
      }

      const user = results[0];

      const deleteData = "DELETE FROM studentdata WHERE id = ?";
      connection.query(deleteData, [userId], (error) => {
        if (error) {
          return res.status(404).json({
            status: StatusCodes.NOT_FOUND,
            message: responsemessage.NOTFOUND,
          });
        }

        return res.status(200).json({
          status: StatusCodes.OK,
          user,
          message: responsemessage.DELETE,
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};
exports.studentSoftDelete = async (req, res) => {
  try {
    const userId = req.currentUser;

    const selectdata = "SELECT * FROM studentdata WHERE id = ?";
    connection.query(selectdata, [userId], async (error, results) => {
      if (error) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: responsemessage.NOTFOUND,
        });
      } else {
        const user = results[0];
        const updatedata =
          "UPDATE studentdata SET isactive = true WHERE id = ?";
        connection.query(updatedata, [userId], (error) => {
          if (error) {
            return res.status(404).json({
              status: StatusCodes.NOT_FOUND,
              message: responsemessage.NOTFOUND,
            });
          } else {
            return res.status(200).json({
              status: StatusCodes.OK,
              user,
              message: responsemessage.DELETED,
            });
          }
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.studentUpdate = async (req, res) => {
  try {
    let { email, phone } = req.body;

    let userId = req.currentUser;

    const selectQuery = "SELECT * FROM studentdata WHERE id = ?";

    connection.query(selectQuery, [userId], async (error, results) => {
      if (error) {
        return res.status(404).json({
          status: StatusCodes.NOT_FOUND,
          message: responsemessage.NOTFOUND,
        });
      } else {
        const existingUser = results[0];
        const checkQuery =
          "SELECT * FROM studentdata WHERE email = ? OR phone = ?";

        connection.query(
          checkQuery,
          [email, phone],
          async (error, results) => {
            let existemail = results.find(
              (studentdata) => studentdata.email === email
            );

            const existphone = results.find(
              (studentdata) => studentdata.phone === parseInt(phone, 10)
            );

            if (existemail || existphone) {
              const message = existemail
                ? responsemessage.EMAILEXITS
                : responsemessage.phoneEXITS;

              res.status(400).json({
                status: StatusCodes.BAD_REQUEST,
                message,
              });
            } else {
              // const useremail = email ? email.toLowerCase() : undefined;
              console.log();
              const profile = req.profileUrl;
              const document = JSON.stringify(req.documentUrl);

              const updatedatas = [];
              const updateValues = [];

              if (email) {
                updatedatas.push("email = ?");
                updateValues.push(email.toLowerCase());
              }
              if (phone) {
                updatedatas.push("phone = ?");
                updateValues.push(phone);
              }
              if (profile) {
                updatedatas.push("profile = ?");
                updateValues.push(profile);
              }
              if (document) {
                updatedatas.push("document = ?");
                updateValues.push(document);
              }
              if (updatedatas.length === 0) {
                return res.status(404).json({
                  status: StatusCodes.NOT_FOUND,
                  message: responsemessage.NOTFOUND,
                });
              } else {
                const updateQuery = `UPDATE studentdata SET ${updatedatas.join(
                  ", "
                )} WHERE id = ?`;
                updateValues.push(userId);

                connection.query(updateQuery, updateValues, (error) => {
                  if (error) {
                    return res.status(400).json({
                      status: StatusCodes.BAD_REQUEST,
                      message: responsemessage.NOTUPDATE,
                    });
                  }

                  res.status(200).json({
                    status: StatusCodes.OK,
                    message: responsemessage.UPDATE,
                  });
                });
              }
            }
          }
        );
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.ChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.currentUser;
    const selectQuery = "SELECT * FROM studentdata WHERE id = ?";

    connection.query(selectQuery, [userId], async (error, results) => {
      if (results.length === 0) {
        return res.status(404).json({
          status: StatusCodes.NOT_FOUND,
          message: responsemessage.NOTFOUND,
        });
      } else {
        const user = results[0];

        if (!validatePassword(newPassword)) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responsemessage.VALIDATEPASS,
          });
        } else {
          const isMatch = await bcrypt.compare(oldPassword, user.password);

          if (!isMatch) {
            return res.status(400).json({
              status: StatusCodes.BAD_REQUEST,
              message: "Old password not match",
            });
          } else {
            const isSamePassword = await bcrypt.compare(
              newPassword,
              user.password
            );
            if (isSamePassword) {
              return res.status(400).json({
                status: StatusCodes.BAD_REQUEST,
                message: "New and old password not match",
              });
            } else if (newPassword !== confirmPassword) {
              return res.status(400).json({
                status: StatusCodes.BAD_REQUEST,
                message: "New and confirm password not match",
              });
            } else {
              const hashedPassword = await passwordencrypt(newPassword);
              const updateQuery =
                "UPDATE studentdata SET password = ? WHERE id = ?";
              connection.query(
                updateQuery,
                [hashedPassword, userId],
                (updateError) => {
                  if (updateError) {
                    console.log(updateError);
                    return res.status(400).json({
                      status: StatusCodes.BAD_REQUEST,
                      message: "Password not change",
                    });
                  } else {
                    return res.status(200).json({
                      status: 200,
                      message: "Succefully change password",
                    });
                  }
                }
              );
            }
          }
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
exports.SendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const expiry = Date.now() + 2 * 60 * 1000; // 10 minutes
    const expiryIST = new Date(expiry).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const userQuery = "SELECT * FROM studentdata WHERE email = ?";

    connection.query(userQuery, [email], async (userError, userRows) => {
      // console.log(userRows);
      // if (userError) {
      //   console.log("Error selecting user:", userError);
      //   return res.status(500).json({
      //     status: 500,
      //     message: responsemessage.INTERROR,
      //   });
      // }

      if (userRows.length === 0) {
        return res.status(404).json({
          status: StatusCodes.NOT_FOUNDSta,
          message: responsemessage.NOTFOUND,
        });
      } else {
        const OTP = generateOTP(); 

        const updateUserQuery =
          "UPDATE studentdata SET otp = ?, otpExpire = ? WHERE email = ?";

        const updateParams = [OTP, expiryIST, email];

        connection.query(
          updateUserQuery,
          updateParams,
          async (updateError, updateResult) => {
            let response = await sendEmail(email, OTP);
            if (response.error) {
              return res.status(503).json({
                status: StatusCodes.SERVICE_UNAVAILABLE,
                message: responsemessage.SERVICE_UNAVAILABLE,
              });
            } else {
              console.log("Email sent:", response.email);
              return res.status(200).json({
                status: StatusCodes.OK,
                email: email,
                OTP: OTP,
                otpExpire: expiryIST,
                message: responsemessage.FOUNDDETAILS,
              });
            }
          }
        );
      }
    });
  } catch (error) {
    // console.error("OTP error:", error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.ForgotPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword || !email) {
      return res.status(400).json({
        status: 400,
        error: true,
        message: responsemessage.NOTEMPTY,
      });
    } else if (!validatePassword(newPassword)) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responsemessage.VALIDATEPASS,
      });
    } else {
      let selectQuery = "SELECT * FROM studentdata WHERE email = ?";
      connection.query(selectQuery, [email], async (userError, userRows) => {
        if (userRows.length === 0) {
          return res.status(404).json({
            status: StatusCodes.NOT_FOUND,
            message: responsemessage.NOTFOUND,
          });
        } else {
          const user = userRows[0];

          if (newPassword !== confirmPassword) {
            return res.status(400).json({
              status: StatusCodes.BAD_REQUEST,
              message: responsemessage.NOTMATCH,
            });
          } else if (
            user.otpExpire <
            new Date().toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })
          ) {
            return res.status(400).json({
              status: StatusCodes.BAD_REQUEST,
              message: responsemessage.TIMEOUT,
            });
          } else {
            const passwordHash = await passwordencrypt(newPassword);

            connection.query(
              "UPDATE studentdata SET  otp = NULL,otpExpire = NULL,password = ? WHERE email = ?",
              [passwordHash, email],
              (updateError) => {
                if (updateError) {
                  console.log(updateError);
                  return res.status(400).json({
                    status: StatusCodes.BAD_REQUEST,
                    message: responsemessage.PASSNOTCHANGE,
                  });
                } else {
                  return res.status(200).json({
                    status: StatusCodes.OK,
                    message: responsemessage.PASSWORDCHANGE,
                  });
                }
              }
            );
          }
        }
      });
    }
  } catch (error) {
    // console.error("reset-password-error", error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.StudentLogout = (req, res) => {
  const token = req.headers.authorization;

  blockTokens.add(token);

  return res.status(200).json({
    status: StatusCodes.OK,
    message: "MessageRespons.logout",
  });
};
// const userId = req.currentUser;
// connection.query(
//   "SELECT * FROM studentdata WHERE id = ?",
//   [userId],
//   (error, results) => {
//     if (error) {
//       console.log(error);
//       return res.status(400).json({
//         status: StatusCodes.BAD_REQUEST,
//         message: responsemessage.LOGOUTERROR,
//       });
//     }

//     return res.status(200).json({
//       status: StatusCodes.OK,
//       message: StatusCodes.USERLOGOUT,
//     });
//   }
// );
// };
