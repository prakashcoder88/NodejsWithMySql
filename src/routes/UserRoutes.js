const express = require("express");
const router = express.Router();
const StudentData = require("../controller/user/UserController")
const CommonService = require("../services/CommonService")
const {StudentValidateToken} = require("../middleware/auth")
const uploadFile = require("../middleware/FileUpload")

router.post("/signup", StudentData.SignUp);
router.post("/signin", StudentData.SignIn);
router.get("/viewdata", StudentValidateToken,StudentData.studentFind);
router.delete("/delete", StudentValidateToken,StudentData.studentDelete);
router.delete("/softdelete", StudentValidateToken,StudentData.studentSoftDelete);
router.post("/logout", StudentValidateToken,StudentData.StudentLogout);

router.patch("/userupdate", StudentValidateToken,uploadFile,StudentData.UserUpdate);
router.post("/forgotpassword", StudentData.ForgotPassword);
router.post("/sendotp", StudentData.SendOTP);
router.post("/verifyotp", CommonService.VerifyOTP);
router.post("/resetpassword", StudentValidateToken,StudentData.ResetPassword);



module.exports = router;