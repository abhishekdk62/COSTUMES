const express = require('express');
const { searchUsers, addCategorys, searchCategories, editCategories } = require('../controllers/adminController');
const router=express.Router()

router.get("/searchusers",searchUsers)
router.post("/addcategorys",addCategorys)
router.get("/searchcategories",searchCategories)
router.get("/editcategories",editCategories)
module.exports=router