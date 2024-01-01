const mongoose = require("mongoose");
const { Schema } = mongoose;

const userCartItemSchema = new Schema({
  cardImg: { type: String, required: true },
  cost: { type: Number, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  type: { type: String, required: true },
  username: { type: String, required: true },
});

const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cart: [userCartItemSchema],
});

const UserModel = mongoose.model("userModel", userSchema);

module.exports = UserModel;
