const express = require('express');
const { searchUsers, addCategorys,restoreProduct,restoreCategory,searchDeletedCategories, searchCategories, editCategories, softdelete, getCategory, addProduct, searchProducts, getProduct, softdeleteProduct, editProduct, searchDeletedProducts } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/verifyToken');
const router=express.Router()


router.get("/searchcategories",searchCategories)
router.get("/searchproducts",searchProducts)
router.post("/getproduct/:id",getProduct)
router.post("/getcategory/:id",getCategory)


router.get("/searchusers", authMiddleware("admin"), searchUsers);
router.post("/addcategorys", authMiddleware("admin"), addCategorys);
router.post("/editcategories", authMiddleware("admin"), editCategories);
router.put("/softdelete/:id", authMiddleware("admin"), softdelete);
router.post("/addProduct", authMiddleware("admin"), addProduct);
router.get("/searchdeletedproducts", authMiddleware("admin"), searchDeletedProducts);
router.put("/softdeleteproduct/:id", authMiddleware("admin"), softdeleteProduct);
router.put("/editproduct/:id", authMiddleware("admin"), editProduct);
router.put("/restoreprod", authMiddleware("admin"), restoreProduct);
router.put("/restorecat", authMiddleware("admin"), restoreCategory);
router.get("/searchdeletedcat", authMiddleware("admin"), searchDeletedCategories);


module.exports=router