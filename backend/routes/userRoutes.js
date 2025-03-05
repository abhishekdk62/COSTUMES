const express = require('express');
// Added googleAuth from userController
const { signup, sendOTP,searchCategoriesToFilter, verifyOTP,getNewArrivals,categoryWiseProducs, resetPassword, searchProducts, getSimilarProducts, filteredProducts, getReview, addReview } = require('../controllers/userController');
const router = express.Router();

router.post("/signup", signup);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/update-password", resetPassword);
router.get("/searchcategoriestofilter",searchCategoriesToFilter)

router.get("/new-arrivals", getNewArrivals);
router.post("/categoryWiseProducs", categoryWiseProducs);
router.post("/getsimilarproducts", getSimilarProducts);
router.get("/products", searchProducts);
router.post("/products",filteredProducts)
router.post("/review",addReview)
router.post("/reviews",getReview)
// router.post("/google-auth", googleAuth); // New route for Google auth via token

module.exports = router;
