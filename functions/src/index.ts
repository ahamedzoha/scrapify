import { pubsub, https, logger } from 'firebase-functions'
import * as admin from 'firebase-admin'
import getCompanyNames from './scrapers/scrapeNames'
import getLiveStockData from './scrapers/scrapeLiveStockData'
import getAllSharePricebyValue from './scrapers/getLatestSharePrice_value'
import getAllSharePricebyTrade from './scrapers/getLatestSharePrice_trade'
import getAllSharePricebyVolume from './scrapers/getLatestSharePrice_volume'

admin.initializeApp()

// Scheduled function that runs every 2nd minute past every hour
// from 10 through 15 on every day-of-week from Sunday through Thursday.
exports.getAllStockTickers = pubsub
  .schedule('*/2 10-15 * * 0-4')
  .onRun(async () => {
    try {
      const stockData = await getLiveStockData()

      await admin
        .firestore()
        .collection('stocks')
        .add({
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          ...stockData,
        })

      logger.info('Ran Function Successfully', {
        structuredData: true,
      })
      console.log(`Successfully scraped ${stockData.length} stocks`)
    } catch (error) {
      console.error(error)
      logger.error('Error scraping stock data', { error })
    }
  })

// Version 2 of the function that saves a flat array of stock data
// Scheduled function that runs every 2nd minute past every hour
// from 10 through 15 on every day-of-week from Sunday through Thursday.
exports.getAllStockTickersV2 = pubsub
  .schedule('*/2 10-15 * * 0-4')
  .onRun(async () => {
    try {
      const stockData = await getLiveStockData()

      await admin
        .firestore()
        .collection('stocks-v2')
        .add([
          ...stockData,
          { timestamp: admin.firestore.FieldValue.serverTimestamp() },
        ])

      logger.info('Ran Function Successfully', {
        structuredData: true,
      })
      console.log(`Successfully scraped ${stockData.length} stocks`)
    } catch (error) {
      console.error(error)
      logger.error('Error scraping stock data', { error })
    }
  })

// testing function using HTTPS method
exports.getAllStockTickersNameHTTP = https.onRequest(async (req, res) => {
  try {
    const stockData = await getLiveStockData()

    await admin
      .firestore()
      .collection('stocks')
      .add({
        ...stockData,
        timestamp: Date.now(),
      })

    logger.info('Ran Function Successfully', {
      structuredData: true,
    })
    console.log(`Successfully scraped ${stockData.length} stocks`)
    res.send([...stockData, { timestamp: Date.now() }])
  } catch (error) {
    logger.error('Unsuccessful Run', { structuredData: true })
    console.log(error)
    res.send(error)
  }
})

// Testing function using HTTPS method
exports.getAllStockNames = https.onRequest(async (req, res) => {
  try {
    const companyNames = await getCompanyNames()
    console.log(companyNames)
    res.send(companyNames)
  } catch (error) {
    res.send(error)
  }
})

// Testing function using HTTPS method
exports.getAllSharePricebyValue = https.onRequest(async (req, res) => {
  try {
    const sharePrice = await getAllSharePricebyValue()
    console.log(sharePrice)
    res.send(sharePrice)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Testing function using HTTPS method
exports.getAllSharePricebyVolume = https.onRequest(async (req, res) => {
  try {
    const sharePrice = await getAllSharePricebyVolume()
    console.log(sharePrice)
    res.send(sharePrice)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Testing function using HTTPS method
exports.getAllSharePricebyTrade = https.onRequest(async (req, res) => {
  try {
    const sharePrice = await getAllSharePricebyTrade()
    console.log(sharePrice)
    res.send(sharePrice)
  } catch (error) {
    res.status(400).send(error)
  }
})
