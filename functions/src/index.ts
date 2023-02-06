import axios from 'axios'
import { load } from 'cheerio'
import { pubsub, https, logger } from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

const URL = `https://www.dsebd.org/`

type StockData = {
  name: string
  prices: {
    current?: string
    changed: string
    changePercent: string
  }
}

// Scheduled function that runs every 2nd minute past every hour
// from 10 through 15 on every day-of-week from Sunday through Thursday.
exports.getAllStockTickers = pubsub
  .schedule('*/2 10-15 * * 0-4')
  .onRun(async (message) => {
    const stockData: StockData[] = []
    await axios
      .get(URL)
      .then(async (resp) => {
        const html = resp.data

        const $ = load(html)

        $('.abhead', html).each(function () {
          $(this).text()

          const companyName =
            $(this)
              .text()
              .replace(/\t/g, '')
              .split(' ')[0]
              .trim()
              .match(/\d?[a-zA-Z]|\([^)]*\)/g) ?? [].join('')

          const priceData =
            $(this)
              .text()
              .match(/[+/-]?[0-9]+\.[0-9]+/g) ?? []

          stockData.push({
            name: companyName.toString(),
            prices: {
              current: priceData[0],
              changed: priceData[1],
              changePercent: `${priceData[2]}%`,
            },
          })
        })
        await admin.firestore().collection('stocks').add({
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          data: stockData,
        })

        logger.info('Ran Function Successfully', {
          structuredData: true,
        })
        console.log(`Successfully scraped ${stockData.length} stocks`)
      })
      .catch((error) => {
        logger.error('Unsuccessful Run', { structuredData: true })
        console.log(error)
      })
  })

// testing function using HTTPS method
exports.getAllStockTickersNameHTTP = https.onRequest(async (req, res) => {
  const stockData: StockData[] = []
  await axios
    .get(URL)
    .then(async (resp) => {
      const html = resp.data

      const $ = load(html)

      $('.abhead', html).each(function () {
        $(this).text()

        const companyName =
          $(this)
            .text()
            .replace(/\t/g, '')
            .split(' ')[0]
            .trim()
            .match(/\d?[a-zA-Z]|\([^)]*\)/g) ?? [].join('')

        const priceData =
          $(this)
            .text()
            .match(/[+/-]?[0-9]+\.[0-9]+/g) ?? ''

        stockData.push({
          name: companyName.toString(),
          prices: {
            current: priceData[0],
            changed: priceData[1],
            changePercent: `${priceData[2]}%`,
          },
        })
      })
      await admin.firestore().collection('stocks').add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        data: stockData,
      })

      logger.info('Ran Function Successfully', {
        structuredData: true,
      })
      console.log(`Successfully scraped ${stockData.length} stocks`)
      res.send(`Successfully scraped ${stockData.length} stocks`)
    })
    .catch((error) => {
      logger.error('Unsuccessful Run', { structuredData: true })
      console.log(error)
      res.send(error)
    })
})
