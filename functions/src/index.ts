import { pubsub, https, logger } from 'firebase-functions'
import * as admin from 'firebase-admin'

import getCompanyNames from './scrapers/scrapeNames'
import getLiveStockData from './scrapers/scrapeLiveStockData'

admin.initializeApp()

// Scheduled function that runs every 2nd minute past every hour
// from 10 through 15 on every day-of-week from Sunday through Thursday.
exports.getAllStockTickers = pubsub
  .schedule('*/2 10-15 * * 0-4')
  .onRun(async () => {
    try {
      const stockData = await getLiveStockData()

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
  try {
    const stockData = await getLiveStockData()

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

exports.getAllStockNames = https.onRequest(async (req, res) => {
  try {
    const companyNames = await getCompanyNames()
    console.log(companyNames)
    res.send(companyNames)
  } catch (error) {
    res.send(error)
  }
})
