const express = require('express');
const { searchUsers, addCategorys,restoreProduct,restoreCategory,searchDeletedCategories, searchCategories, editCategories, softdelete, getCategory, addProduct, searchProducts, getProduct, softdeleteProduct, editProduct, searchDeletedProducts } = require('../controllers/adminController');
const router=express.Router()

router.get("/searchusers",searchUsers)

router.post("/addcategorys",addCategorys)
router.get("/searchcategories",searchCategories)
router.post("/editcategories",editCategories)
router.put("/softdelete/:id",softdelete)
router.post("/getcategory/:id",getCategory)

router.post("/addProduct",addProduct)
router.get("/searchproducts",searchProducts)
router.get("/searchdeletedproducts",searchDeletedProducts)
router.post("/getproduct/:id",getProduct)
router.put("/softdeleteproduct/:id",softdeleteProduct)
router.put("/editproduct/:id",editProduct)
router.put("/restoreprod",restoreProduct)
router.put("/restorecat",restoreCategory)
router.get("/searchdeletedcat",searchDeletedCategories)




module.exports=router