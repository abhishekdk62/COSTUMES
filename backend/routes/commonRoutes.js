const express = require('express');
const { login, updateProfile } = require('../controllers/commonController');
const router=express.Router()

router.post("/login",login)
router.post("/update",updateProfile)

module.exports=router