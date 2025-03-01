const express = require('express');
const { signup, sendOTP, verifyOTP, resetPassword } = require('../controllers/userController');
const router=express.Router()

router.post("/signup",signup)
router.post("/send-otp",sendOTP)
router.post("/verify-otp",verifyOTP)
router.post("/update-password",resetPassword)

module.exports=router