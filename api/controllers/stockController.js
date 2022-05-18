const axios = require("axios")
const { initializeApp } = require("firebase/app")
const {
  getFirestore,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  where,
} = require("firebase/firestore")
const firebaseConfig = require("../config")

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const stocksRef = collection(db, "stocks")

// @author - Azaz
// @desc  Get all stock tickers
// @route GET /api/stocks
const getAllStockTickers = async (req, res) => {
  let stockTickers = { data: [], timestamp: null }

  const q = query(stocksRef, orderBy("timestamp", "desc"), limit(1))

  const Stocks = await getDocs(q)
  Stocks.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`)
    stockTickers.data.push(...doc.data().data)
    stockTickers.timestamp = doc.data().timestamp.toDate()
  })

  res.status(200).send(stockTickers)
}

// @author - Azaz
// @desc  Get specific stock ticker based on ID (STOCK NAME)
// @route GET /api/stocks
const getSpecificStockTicker = async (req, res) => {
  let stockTicker = { searched: "", data: [], timestamp: null }

  const q = query(stocksRef, where("data", "array-contains", req.params.id))

  stockTicker.searched = req.params.id

  const Stocks = await getDocs(q)
  Stocks.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`)
    stockTicker.data.push(doc.data().data)
    stockTicker.timestamp = doc.data().timestamp.toDate()
  })

  // res.status(200).send({
  //   sent: {
  //     reqID: req.params.id,
  //   },
  // })
  res.status(200).send(stockTicker)
}

module.exports = {
  getAllStockTickers,
  getSpecificStockTicker,
}
