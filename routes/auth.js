const express = require("express");
const {
  test,
  handleRegister,
  handleLogin,
  handleProfile,
  handleLogout,
} = require("../controllers/authController");
const {
  saveCartItems,
  getCartItems,
  handlePay,
} = require("../controllers/cartItemController");
const router = express.Router();

router.get("/", test);

router.post("/register", handleRegister);

router.post("/login", handleLogin);

router.get("/profile", handleProfile);

router.post("/logout", handleLogout);

router.post("/save", saveCartItems);

router.post("/pay", handlePay);

module.exports = router;
