const express = require("express");
const {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
} = require("../controllers/authController");
const { requireSingIn, isAdmin } = require("../middlewares/authMiddleware");

// router object
const router = express.Router();

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// test routes
router.get("/test", requireSingIn, isAdmin, testController);

// protected route
router.get("/user-auth", requireSingIn, (req, res) => {
  res.status(200).send({ok:true})
});

module.exports = router;
