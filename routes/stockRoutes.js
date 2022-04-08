const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Stock API",
  })
})

module.exports = router
