const express = require("express");
const router = express.Router();
const StudentData = require("../controller/user/UserController")
const CommonService = require("../services/CommonService")
const {UserValidateToken} = require("../middleware/auth")
const uploadFile = require("../middleware/FileUpload")

router.post("/signup", StudentData.SignUp);
router.post("/signin", StudentData.SignIn);
router.get("/viewdata", UserValidateToken,StudentData.UserFind);
router.delete("/userdelete", UserValidateToken,StudentData.UserDelete);
router.patch("/userupdate", UserValidateToken,uploadFile,StudentData.UserUpdate);
router.post("/forgotpassword", StudentData.ForgotPassword);
router.post("/sendotp", StudentData.SendOTP);
router.post("/verifyotp", CommonService.VerifyOTP);
router.post("/resetpassword", UserValidateToken,StudentData.ResetPassword);
router.post("/logout", UserValidateToken,StudentData.UserLogout);


module.exports = router;