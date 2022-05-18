const axios = require("axios")
const { initializeApp } = require("firebase/app")
const { getFirestore, getDocs, collection } = require("firebase/firestore")
const firebaseConfig = require("../config")

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// @author - Azaz
// @desc  Get all stock tickers
// @route GET /api/stocks
const getAllStockTickers = async (req, res) => {
  let stockTickers = []
  const Stocks = await getDocs(collection(db, "stocks"))
  Stocks.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`)
    stockTickers.push(doc.data())
  })

  res.status(200).send(stockTickers)
}

// @author - Azaz
// @desc  Get specific stock ticker based on ID (STOCK NAME)
// @route GET /api/stocks
const getSpecificStockTicker = (req, res) => {}

module.exports = {
  getAllStockTickers,
  getSpecificStockTicker,
}
