const express = require("express")
const router = express.Router()
const cache = require("../routeCache")
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user")

router.route("/").get(cache(500), getAllUsers).post(createUser)

router
  .route("/:id")
  .get(cache(500), getUser)
  .patch(updateUser)
  .delete(deleteUser)

module.exports = router
