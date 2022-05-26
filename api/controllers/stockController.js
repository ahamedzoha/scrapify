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

      const range_through_day = $(
        "#company > tbody > tr:nth-child(2) > td:nth-child(4)",
        window
      )
        .first()
        .text()

      const change_taka = $(
        "#company > tbody > tr:nth-child(3) > td:nth-child(2)",
        window
      )
        .first()
        .text()

      const change_percentage = $(
        "#company > tbody > tr:nth-child(4) > td:nth-child(1)",
        window
      )
        .first()
        .text()
        .trim()

      const days_value = $(
        "#company > tbody > tr:nth-child(3) > td:nth-child(4)",
        window
      )
        .first()
        .text()

      const year_moving_range = $(
        "#company > tbody > tr:nth-child(4) > td:nth-child(3)",
        window
      )
        .first()
        .text()

      const opening_price = $(
        "#company > tbody > tr:nth-child(5) > td:nth-child(2)",
        window
      )
        .first()
        .text()

      const adjusted_opening_price = $(
        "#company > tbody > tr:nth-child(6) > td:nth-child(2)",
        window
      )
        .first()
        .text()

      const yesterdays_closing_price = $(
        "#company > tbody > tr:nth-child(7) > td:nth-child(2)",
        window
      )
        .first()
        .text()

      const days_vol_nos = $(
        "#company > tbody > tr:nth-child(5) > td:nth-child(4)",
        window
      )
        .first()
        .text()

      const days_trade_nos = $(
        "#company > tbody > tr:nth-child(6) > td:nth-child(4)",
        window
      )
        .first()
        .text()

      const market_cap = $(
        "#company > tbody > tr:nth-child(7) > td:nth-child(4)",
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
        opening_price: opening_price,
        adjusted_opening_price: adjusted_opening_price,
        yesterdays_closing_price: yesterdays_closing_price,
        last_trading_price: last_trading_price,
        last_closing_price: last_closing_price,
        last_update_time: last_update_time,
        range_through_day: range_through_day,
        days_value_mn: days_value,
        year_moving_range: year_moving_range,
        days_trade_nos: days_trade_nos,
        days_vol_nos: days_vol_nos,
        market_cap: market_cap,
        changes: {
          change_taka: change_taka,
          change_percentage: change_percentage,
        },
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
