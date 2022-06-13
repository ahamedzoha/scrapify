const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email is already in use"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: Date,
  updatedAt: Date,
})
const User = mongoose.model("User", userSchema, "users")

module.exports = User
