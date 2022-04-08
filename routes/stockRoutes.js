const express = require("express")
const router = express.Router()

const {
  getAllStockTickers,
  getSpecificStockTicker,
} = require("../controllers/stockController")

router.get("/", getAllStockTickers)
router.get("/:id", getSpecificStockTicker)

module.exports = router
