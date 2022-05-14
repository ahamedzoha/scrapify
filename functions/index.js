const axios = require("axios")
const cheerio = require("cheerio")
const functions = require("firebase-functions")
const admin = require("firebase-admin")

admin.initializeApp()

const URL = `https://www.dsebd.org/`
let stockData = []

// Scheduled function that runs every 2nd minute past every hour
// from 10 through 15 on every day-of-week from Sunday through Thursday.
exports.getAllStockTickers = functions.pubsub
  .schedule("*/2 10-15 * * 0-4")
  .onRun(async (message) => {
    stockData = []
    await axios
      .get(URL)
      .then(async (resp) => {
        const html = resp.data

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
        await admin.firestore().collection("stocks").add({
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          data: stockData,
        })

        functions.logger.info("Ran Function Successfully", {
          structuredData: true,
        })
        console.log(`Successfully scraped ${stockData.length} stocks`)
      })
      .catch((error) => {
        functions.logger.error("Unsuccessful Run", { structuredData: true })
        console.log(error)
      })
  })

// testing function using HTTPS method
exports.getAllStockTickersHTTP = functions.https.onRequest(async (req, res) => {
  stockData = []
  await axios
    .get(URL)
    .then(async (resp) => {
      const html = resp.data

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
      await admin.firestore().collection("stocks").add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        data: stockData,
      })

      functions.logger.info("Ran Function Successfully", {
        structuredData: true,
      })
      console.log(`Successfully scraped ${stockData.length} stocks`)
      res.end(JSON.stringify(stockData.length))
    })
    .catch((error) => {
      functions.logger.error("Unsuccessful Run", { structuredData: true })
      console.log(error)
    })
})
