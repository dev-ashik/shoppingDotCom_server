const express = require('express');
const registerController = require('../controllers/authController');

// router object
const router = express.Router();


// router.use((req, res, next) => {
//     // your middleware logic here
//     next();
//   });

// Register 
router.post('/register', registerController)

module.exports = router;