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
// const firebaseConfig = require("../../config")

const apiKey = process.env.FIREBASE_APIKEY
const authDomain = process.env.FIREBASE_AUTHDOMAIN
const projectId = process.env.FIREBASE_PROJECTID
const storageBucket = process.env.FIREBASE_STORAGEBUCKET
const messagingSenderId = process.env.FIREBASE_MESSAGESENDERID
const appId = process.env.FIREBASE_APPID
const measurementId = process.env.FIREBASE_MEASUREMENTID

const configObj = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
}

const app = initializeApp(configObj)
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
    // console.log(`${doc.id} => ${doc.data()}`)
    stockTickers.data.push(...doc.data().data)
    stockTickers.timestamp = doc.data().timestamp.toDate()
  })
  console.log(configObj)
  res.status(200).send(stockTickers)
}

module.exports = {
  getAllStockTickers,
}
