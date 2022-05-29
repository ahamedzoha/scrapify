const express = require("express")
const router = express.Router()
const cache = require("../routeCache")
const {
  getAllStockTickers,
  getCompanyDetails,
} = require("../controllers/stock")

router.route("/").get(getAllStockTickers)
router.route("/:id").get(cache(500), getCompanyDetails)

module.exports = router
