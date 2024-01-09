const express = require('express');
const { register, login, verifyuser, checkuser, changePassword,changeUserPassword,updateUserProfile } = require("../controllers/auth.controller");
const router = express.Router();
const otpService = require("../services/otp.services")
const { validateToken } = require("../middleware/validateTokenHandler")

// router.route("/register").post(otpService.verifyOtp, register);
router.route("/register").post(register);
// router.route("/changepassword").post(otpService.verifyOtp, changePassword);
router.route("/changepassword").post(changePassword);

router.route("/resendOTP").post(otpService.resendOtp);

router.route("/verifyUser").post(verifyuser);
router.route("/checkuser").post(checkuser);


router.route("/login").post(login);

router.route('/verifyOtp').post(otpService.verifyOtp);
router.route('/sendSMS').post(otpService.sendOtp);

router.use(validateToken)
router.route("/updatepassword").post(changeUserPassword);
router.route("/updateprofile").post(updateUserProfile);
module.exports = router;
