const express = require("express")
const router = express.Router()
const cache = require("../routeCache")
const {
  getAllStockTickers,
  getSpecificStockTicker,
} = require("../controllers/stockController")

router.get("/", getAllStockTickers)
router.get("/:id", cache(500), getSpecificStockTicker)

module.exports = router
