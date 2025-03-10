const express = require('express');
const { searchUsers,editCoupon,restoreCoupon,softdeleteCoupon,searchDeletedCoupons, addCategorys,restoreProduct,restoreCategory,searchDeletedCategories, searchCategories, editCategories, softdelete, getCategory, addProduct, searchProducts, getProduct, softdeleteProduct, editProduct, searchDeletedProducts, addCoupon, searchCoupons } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/verifyToken');
const router=express.Router()


router.get("/searchcategories",searchCategories)
router.get("/searchproducts",searchProducts)
router.post("/getproduct/:id",getProduct)
router.post("/getcategory/:id",getCategory)
router.post("/addcoupon",addCoupon)
router.put("/softdeletecoupon/:id", softdeleteCoupon);
router.get("/searchdeletedcoupons", searchDeletedCoupons);
router.put("/restorecoupon/:id", restoreCoupon);

router.get("/searchusers", authMiddleware("admin"), searchUsers);
router.get("/searchcoupons", authMiddleware("admin"), searchCoupons);

router.get("/searchusers", authMiddleware("admin"), searchUsers);
router.post("/addcategorys", authMiddleware("admin"), addCategorys);
router.post("/editcategories", authMiddleware("admin"), editCategories);


router.post("/editcoupon/:id", editCoupon);


router.put("/softdelete/:id", authMiddleware("admin"), softdelete);
router.post("/addProduct", authMiddleware("admin"), addProduct);
router.get("/searchdeletedproducts", authMiddleware("admin"), searchDeletedProducts);
router.put("/softdeleteproduct/:id", authMiddleware("admin"), softdeleteProduct);
router.put("/editproduct/:id", authMiddleware("admin"), editProduct);
router.put("/restoreprod", authMiddleware("admin"), restoreProduct);
router.put("/restorecat", authMiddleware("admin"), restoreCategory);
router.get("/searchdeletedcat", authMiddleware("admin"), searchDeletedCategories);


module.exports=router