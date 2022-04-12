const axios = require("axios")
const cheerio = require("cheerio")

const URL = `https://www.dsebd.org/`
const stockData = []

// @author - Azaz
// @desc  Get all stock tickers
// @route GET /api/stocks
const getAllStockTickers = async (req, res) => {
  await axios
    .get(URL)
    .then((response) => {
      const html = response.data

      const $ = cheerio.load(html)

      $(".abhead", html).each(function () {
        $(this).text()

        const companyName = $(this)
          .text()
          .replace(/\t/g, "")
          .split(" ")[0]
          .trim()
          .match(/\d?[a-zA-Z]|\([^)]*\)/g)
          .join("")

        const priceData = $(this)
          .text()
          .match(/[+/-]?[0-9]+\.[0-9]+/g)

        stockData.push({
          name: companyName,
          prices: {
            current: priceData[0],
            changed: priceData[1],
            changePercent: `${priceData[2]}%`,
          },
        })
      })
      //   console.log(stockData)
    })
    .catch((error) => {
      console.log(error)
    })

  res.status(200).json(stockData)
}

// @author - Azaz
// @desc  Get specific stock ticker based on ID (STOCK NAME)
// @route GET /api/stocks
const getSpecificStockTicker = (req, res) => {
  //   res.status(200).json({
  //     message: `Welcome to the Stock API ${req.params.id}`,
  //   })
  console.log(req.params.id)
  console.log(req.body)
  res.status(200).json({ message: `${req.body}` })
}

module.exports = {
  getAllStockTickers,
  getSpecificStockTicker,
}
