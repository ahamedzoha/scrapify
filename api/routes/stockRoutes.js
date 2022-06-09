const express = require("express")
const router = express.Router()
const cache = require("../routeCache")
const { checkCompany } = require("./middlewares/stock_routes_middlewares")
const {
  getAllStockTickers,
  getCompanyDetails,
  checkID,
} = require("../controllers/stock")

// Param Middleware
// Extra request increases (local)180ms+ of latency to the whole request
// Possible solution: check if the company name is not empty
router.param("id", checkID)

router.route("/").get(getAllStockTickers)
router.route("/:id").get(cache(500), getCompanyDetails)

module.exports = router
