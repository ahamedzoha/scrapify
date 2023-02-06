import axios from 'axios'
import { load } from 'cheerio'
import { pubsub, https, logger } from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

const URL = `https://www.dsebd.org/`

type StockData = {
  name: string
  prices: {
    current: string
    changed: string
    changePercent: string
  }
}

// Scheduled function that runs every 2nd minute past every hour
// from 10 through 15 on every day-of-week from Sunday through Thursday.
exports.getAllStockTickers = pubsub
  .schedule('*/2 10-15 * * 0-4')
  .onRun(async () => {
    const stockData: StockData[] = []

    try {
      const resp = await axios.get(URL)
      const $ = load(resp.data)

      $('.abhead').each(function () {
        const companyName =
          $(this)
            .text()
            .trim()
            .split(' ')[0]
            .match(/[A-Za-z0-9]+/g)
            ?.join('') || ''

        const priceData =
          $(this)
            .text()
            .match(/[+-]?[0-9]+\.[0-9]+/g) || []

        stockData.push({
          name: companyName,
          prices: {
            current: priceData[0] ? priceData[0] : '',
            changed: priceData[1],
            changePercent: `${priceData[2]}%`,
          },
        })
      })

      await admin.firestore().collection('stocks').add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        data: stockData,
      })

      console.log(`Successfully scraped ${stockData.length} stocks`)
    } catch (error) {
      console.error(error)
      logger.error('Error scraping stock data', { error })
    }
  })

// testing function using HTTPS method
exports.getAllStockTickersNameHTTP = https.onRequest(async (req, res) => {
  const stockData: StockData[] = []

  try {
    const resp = await axios.get(URL)
    const $ = load(resp.data)

    $('.abhead').each(function () {
      const companyName =
        $(this)
          .text()
          .replace(/\t/g, '')
          .split(' ')[0]
          .trim()
          .match(/\d?[a-zA-Z]|\([^)]*\)/g)
          ?.join('') ?? [].join('')

      const priceData =
        $(this)
          .text()
          .match(/[+/-]?[0-9]+\.[0-9]+/g) ?? []

      stockData.push({
        name: companyName.toString(),
        prices: {
          current: priceData[0] ? priceData[0] : '',
          changed: priceData[1],
          changePercent: `${priceData[2]}%`,
        },
      })
    })
    await admin.firestore().collection('stocks').add({
      timestamp: Date.now(),
      data: stockData,
    })

    logger.info('Ran Function Successfully', {
      structuredData: true,
    })
    console.log(`Successfully scraped ${stockData.length} stocks`)
    res.send({
      message: `Successfully scraped ${stockData.length} stocks`,
      data: stockData,
    })
  } catch (error) {
    logger.error('Unsuccessful Run', { structuredData: true })
    console.log(error)
    res.send(error)
  }
})
