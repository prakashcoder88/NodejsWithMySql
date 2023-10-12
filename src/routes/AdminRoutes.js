const express = require("express");
const admindata = require("../controller/admin/AdminController")
const studentaccess = require("../controller/admin/StudentManegment")
// const connection = require("../../config/Db.config");
const CommonService = require("../services/CommonService")
const uploadFile = require("../middleware/FileUpload")
const router = express.Router();

const {adminauthenticationToken} = require("../middleware/auth")

//Admin Routes
router.post("/signup",  admindata.AdminSingup);
router.post("/signin",  admindata.AdminSingIn);
router.patch("/update", adminauthenticationToken,uploadFile,admindata.Updateadmin)
router.patch("/resetpassword",  adminauthenticationToken,admindata.AdminResetPassword);
router.post("/SendOTP",  admindata.SendOTP);
router.post("/forgotpassword",  admindata.AdminForgotPassword);
router.post("/singout", adminauthenticationToken,admindata.Adminlogout);
router.post("/verifyotp",  CommonService.AdminVerifyOTP);




//User Routes
router.post("/studentsingup",  adminauthenticationToken,studentaccess.SignUp);
router.get("/studentfind", adminauthenticationToken,studentaccess.StudentFind);
router.get("/allstudent", adminauthenticationToken,studentaccess.StudentFindAll);
router.delete("/studentdelete", adminauthenticationToken,studentaccess.StudentDelete);
router.patch("/studentupdate", adminauthenticationToken,studentaccess.StudentUpdate,);
router.patch("/studentactive", adminauthenticationToken,studentaccess.StudentActive);

module.exports = router;