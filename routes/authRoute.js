const express = require("express");
const {
  registerController,
  loginController,
  testController,
} = require("../controllers/authController");
const { requireSingIn, isAdmin } = require("../middlewares/authMiddleware");

// router object
const router = express.Router();

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// test routes
router.get("/test", requireSingIn, isAdmin, testController);

module.exports = router;
