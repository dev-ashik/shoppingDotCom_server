const express = require("express");
const { requireSingIn, isAdmin } = require("../middlewares/authMiddleware");
const { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFiltersController, productSerarchController } = require("../controllers/productController");
// express-formidable used to image upload
const formidableMiddleware = require('express-formidable');


const router = express.Router();


// routes
router.post('/create-product', requireSingIn, isAdmin, formidableMiddleware(), createProductController)

// update product
router.put('/update-product/:pid', requireSingIn, isAdmin, formidableMiddleware(), updateProductController)

// get products
router.get('/products', getProductController)


// single products
router.get('/products/:slug', getSingleProductController)


// get photo
router.get('/product-photo/:pid', productPhotoController)

// delete product
router.delete('/delete-product/:pid',requireSingIn, isAdmin,  deleteProductController)

// filter product
router.post('/product-filters', productFiltersController)

// search product
router.get('/search/:keyword', productSerarchController)

module.exports = router;