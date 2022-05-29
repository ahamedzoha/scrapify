const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This endpoint is not yet implemented",
  })
}
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This endpoint is not yet implemented",
  })
}
const createUser = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "User Created Successfully",
  })
}
const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This endpoint is not yet implemented",
  })
}
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This endpoint is not yet implemented",
  })
}

module.exports = {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
}
