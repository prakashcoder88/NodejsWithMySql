const express = require("express");
const admindata = require("../controller/admin/AdminController")
const useraccess = require("../controller/admin/UserManegment")
// const connection = require("../../config/Db.config");
const CommonService = require("../services/CommonService")
const uploadFile = require("../middleware/FileUpload")
const router = express.Router();

const {adminauthenticationToken} = require("../middleware/auth")

//Admin Routes
router.post("/signup",  admindata.AdminSingup);
router.post("/signin",  admindata.AdminSingIn);
router.patch("/update", adminauthenticationToken,uploadFile,admindata.UpdateAdminData)
router.patch("/resetpassword",  adminauthenticationToken,admindata.AdminResetPassword);
router.post("/SendOTP",  admindata.SendOTP);
router.post("/forgotpassword",  admindata.AdminForgotPassword);
router.post("/singout", adminauthenticationToken,admindata.Adminlogout);
router.post("/verifyotp",  CommonService.AdminVerifyOTP);




//User Routes
router.post("/usersingup",  adminauthenticationToken,uploadFile,useraccess.SignUp);
router.get("/userfind", adminauthenticationToken,useraccess.UserFind);
router.get("/alluser", adminauthenticationToken,useraccess.UserFindAll);
router.delete("/userdelete", adminauthenticationToken,useraccess.UserDelete);
router.patch("/userupdate", adminauthenticationToken,uploadFile,useraccess.UserUpdate,);
router.patch("/useractive", adminauthenticationToken,useraccess.userActive);

module.exports = router;