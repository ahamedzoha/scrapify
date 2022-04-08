// @author - Azaz
// @desc  Get all stock tickers
// @route GET /api/stocks
const getAllStockTickers = (req, res) => {
  res.status(200).json({
    message: "Welcome to the Stock API",
  })
}

// @author - Azaz
// @desc  Get specific stock ticker based on ID (STOCK NAME)
// @route GET /api/stocks
const getSpecificStockTicker = (req, res) => {
  res.status(200).json({
    message: `Welcome to the Stock API ${req.params.id}`,
  })
}

module.exports = {
  getAllStockTickers,
  getSpecificStockTicker,
}
