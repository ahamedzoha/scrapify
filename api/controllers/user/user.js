const User = require("../../models/userModel")

const getUser = async (req, res) => {
  try {
    const userData = await User.findById(req.params.id)
    res.status(200).json({
      status: "success",
      data: userData,
    })
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    })
  }
}
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find()
    res.status(200).json({
      status: "success",
      message: "All Users Retrieved Successfully",
      length: allUsers.length,
      data: allUsers,
    })
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    })
  }
}
const createUser = async (req, res) => {
  try {
    const newUser = await User.create({
      ...req.body,
      createdAt: new Date(),
    })
    res.status(200).json({
      status: "success",
      message: "User Created Successfully",
      data: {
        user: newUser,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      status: "success",
      message: "User Updated Successfully",
      data: {
        user: updatedUser,
      },
    })
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    })
  }
}
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: "success",
      message: "User Deleted Successfully",
      data: null,
    })
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    })
  }
}

module.exports = {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
}
