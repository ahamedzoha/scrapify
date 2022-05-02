const axios = require("axios")
const cheerio = require("cheerio")

const URL = `https://www.dsebd.org/`
const stockData = []

exports.getAllStockTickers = async () => {
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
          raw: $(this).text(),
        })
      })
      console.log(stockData)
      console.log(`Successfully scraped ${stockData.length} stocks`)
    })
    .catch((error) => {
      console.log(error)
    })
}
