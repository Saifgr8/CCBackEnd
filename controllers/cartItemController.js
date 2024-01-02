const UserModel = require("../models/userModel");

//post to save cart items

const saveCartItems = async (req, res) => {
  try {
    const cartItems = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      res.json({ error: "Invalid or empty cart items array" });
      return;
    }

    // Extract the username from the first item (assuming all items have the same username)
    const { username } = cartItems[0];

    // Check valid user
    const user = await UserModel.findOne({ userName: username }).exec();

    if (!user) {
      res.json({ error: "Unidentified User, Please login first" });
      return;
    }

    // Assign the array of cart items to user.cart
    user.cart = cartItems;

    await user.save();
    res.json({ message: "Successfully added to profile" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//clearAfterPay
const handlePay = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await UserModel.findOne({ userName: username }).exec();

    if (!user) {
      res.json({ error: "user not found" });
    }

    user.cart = [];
    await user.save();

    res.json({ message: "Payment success" });
  } catch (error) {
    console.error(error);
    console.log("failed to complete payment");
  }
};

module.exports = { saveCartItems, handlePay };
