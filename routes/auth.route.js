const express = require('express');
const { register, login } = require("../controllers/auth.controller");
const router = express.Router();
const otpService = require("../services/otp.services")

router.route("/register").post(otpService.sendOtp, register);
router.route("/login").post( login);

module.exports = router;
