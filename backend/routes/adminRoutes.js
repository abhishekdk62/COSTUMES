const express = require('express');
const { searchUsers, addCategorys, searchCategories, editCategories, softdelete, getCategory } = require('../controllers/adminController');
const router=express.Router()

router.get("/searchusers",searchUsers)
router.post("/addcategorys",addCategorys)
router.get("/searchcategories",searchCategories)
router.post("/editcategories",editCategories)
router.put("/softdelete/:id",softdelete)
router.post("/getcategory/:id",getCategory)



module.exports=router