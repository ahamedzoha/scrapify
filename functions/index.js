const axios = require("axios")
const cheerio = require("cheerio")
const functions = require("firebase-functions")
const admin = require("firebase-admin")
const { initializeApp } = require("firebase-admin/app")
const Firestore = require("@google-cloud/firestore")
var serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp()
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// })
// // Use your project ID here
// const PROJECTID = "[YOUR_PROJECT_ID]"
// const COLLECTION_NAME = "cloud-functions-firestore"

// const firestore = new Firestore({
//   projectId: PROJECTID,
//   timestampsInSnapshots: true,
//   // NOTE: Don't hardcode your project credentials here.
//   // If you have to, export the following to your shell:
//   //   GOOGLE_APPLICATION_CREDENTIALS=<path>
//   // keyFilename: '/cred/cloud-functions-firestore-000000000000.json',
// })

// /**
//  * Retrieve or store a method in Firestore
//  *
//  * Responds to any HTTP request.
//  *
//  * GET = retrieve
//  * POST = store (no update)
//  *
//  * success: returns the document content in JSON format & status=200
//  *    else: returns an error:<string> & status=404
//  *
//  * @param {!express:Request} req HTTP request context.
//  * @param {!express:Response} res HTTP response context.
//  */

const URL = `https://www.dsebd.org/`
let stockData = []

exports.getAllStockTickers = functions.pubsub
  .schedule("*/2  *  *  *  *")
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
      res.end(JSON.stringify(stockData))
    })
    .catch((error) => {
      functions.logger.error("Unsuccessful Run", { structuredData: true })
      console.log(error)
    })
})
