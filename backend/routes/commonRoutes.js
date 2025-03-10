const express = require('express');
const { login, updateProfile, logout, check } = require('../controllers/commonController');
const router=express.Router()

router.post("/login",login)
router.post("/update",updateProfile)
router.post("/logout",logout)
router.get("/check",check)

module.exports=router