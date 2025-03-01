const express = require('express');
const { searchUsers, addCategorys, searchCategories, editCategories, softdelete, getCategory, addProduct, searchProducts, getProduct, softdeleteProduct, editProduct } = require('../controllers/adminController');
const router=express.Router()

router.get("/searchusers",searchUsers)

router.post("/addcategorys",addCategorys)
router.get("/searchcategories",searchCategories)
router.post("/editcategories",editCategories)
router.put("/softdelete/:id",softdelete)
router.post("/getcategory/:id",getCategory)

router.post("/addProduct",addProduct)
router.get("/searchproducts",searchProducts)
router.post("/getproduct/:id",getProduct)
router.put("/softdeleteproduct/:id",softdeleteProduct)
router.put("/editproduct/:id",editProduct)




module.exports=router