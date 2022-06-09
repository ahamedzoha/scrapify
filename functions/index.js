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
exports.getAllStockTickersNameHTTP = functions.https.onRequest(
  async (req, res) => {
    TickerNames = []
    const URI = "https://www.dsebd.org/latest_share_price_scroll_l.php"
    await axios
      .get(URI)
      .then(async (resp) => {
        const html = resp.data

        const $ = cheerio.load(html)
        const window = $(".row", html).html()

        $(
          "#RightBody > div.row > div.col-md-9.col-sm-9.col-xs-9.full-width-mobile > div.floatThead-wrapper > div.table-responsive.inner-scroll > table > tbody > tr > td:nth-child(2)"
        ).each(function () {
          $(this).text()

          const companyName = $(this)

          TickerNames.push(companyName)
        })

        // delete all documents from collection
        await admin
          .firestore()
          .collection("stock_ids")
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              doc.ref.delete()
            })
          })
          .catch((error) => {
            console.log(error)
          })

        // add all ticker names to collection
        await admin
          .firestore()
          .collection("stock_ids")
          .add({ ...TickerNames })

        functions.logger.info("Ran Function Successfully", {
          structuredData: true,
        })
        console.log(`Successfully scraped ${TickerNames.length} stocks`)

        res.send({
          length: JSON.stringify(TickerNames.length),
          data: TickerNames,
        })
      })
      .catch((error) => {
        functions.logger.error("Unsuccessful Run", { structuredData: true })
        console.log(error)
      })
  }
)
