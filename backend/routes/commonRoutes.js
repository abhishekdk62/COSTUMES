const express = require('express');
const { login, updateProfile, logout } = require('../controllers/commonController');
const router=express.Router()

router.post("/login",login)
router.post("/update",updateProfile)
router.post("/logout",logout)

module.exports=router