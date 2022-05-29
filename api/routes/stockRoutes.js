const express = require("express")
const router = express.Router()
const cache = require("../routeCache")
const {
  getAllStockTickers,
  getCompanyDetails,
} = require("../controllers/stock")

router.get("/", getAllStockTickers)
router.get("/:id", cache(500), getCompanyDetails)

module.exports = router
