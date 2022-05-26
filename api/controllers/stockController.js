const axios = require("axios")
const tabletojson = require("tabletojson").Tabletojson
const cheerio = require("cheerio")
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
  // let stockTicker = { searched: "", data: [], timestamp: null }

  const URL = `https://www.dsebd.org/displayCompany.php?name=${req.params.id}`
  await axios
    .get(URL)
    .then(async (resp) => {
      const html = resp.data
      const $ = cheerio.load(html, {
        ignoreWhitespace: true,
        normalizeWhitespace: true,
      })

      const window = $(".row", html).html()

      const companyName = $("h2>i", window).first().text()

      const trading_code = $("#company > tbody > tr > th:nth-child(1)", window)
        .first()
        .text()
        .split(" ")[2]

      const scrip_code = $("#company > tbody > tr > th:nth-child(2)", window)
        .first()
        .text()
        .split(" ")[2]

      const market_info_date = $(
        "#section-to-print > h2:nth-child(5) > i",
        window
      ).text()

      const last_trading_price = $(
        "#company > tbody > tr:nth-child(1) > td:nth-child(2)",
        window
      )
        .first()
        .text()

      const last_closing_price = $(
        "#company > tbody > tr:nth-child(1) > td:nth-child(4)",
        window
      )
        .first()
        .text()

      const last_update_time = $(
        "#company > tbody > tr:nth-child(2) > td:nth-child(2)",
        window
      )
        .first()
        .text()

      let basicInfo = {
        companyName: companyName,
        trading_code: trading_code,
        scrip_code: scrip_code,
      }

      let market_info = {
        market_info_date: market_info_date,
        last_trading_price: last_trading_price,
        last_closing_price: last_closing_price,
        last_update_time: last_update_time,
      }

      let full_info = {
        basic_info: basicInfo,
        market_info: market_info,
      }

      res.status(200).json(full_info)
    })
    .catch((error) => {
      console.log(error)
      res.end()
    })
}

module.exports = {
  getAllStockTickers,
  getSpecificStockTicker,
}
