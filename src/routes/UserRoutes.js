const express = require("express");
const router = express.Router();
const StudentData = require("../controller/user/StudentController")
const CommonService = require("../services/CommonService")
const {StudentValidateToken} = require("../middleware/auth")
const uploadFile = require("../middleware/FileUpload")

router.post("/signup", StudentData.SignUp);
router.post("/signin", StudentData.SignIn);
router.get("/viewdata", StudentValidateToken,StudentData.studentFind);
router.delete("/delete", StudentValidateToken,StudentData.studentDelete);
router.delete("/softdelete", StudentValidateToken,StudentData.studentSoftDelete);
router.post("/logout", StudentValidateToken,StudentData.StudentLogout);
router.post("/resetpassword", StudentValidateToken,StudentData.ChangePassword);
router.post("/sendemail", StudentData.SendOTP);
router.post("/verifyotp", CommonService.VerifyOTP);
router.patch("/studentupdate", StudentValidateToken,StudentData.studentUpdate);
router.post("/forgotpassword", StudentData.ForgotPassword);





module.exports = router;