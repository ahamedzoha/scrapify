import { pubsub, https, logger } from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore'
import getCompanyNames from './scrapers/scrapeNames'
import getLiveStockData from './scrapers/scrapeLiveStockData'
import getAllSharePricebyValue from './scrapers/getLatestSharePrice_value'
import getAllSharePricebyTrade from './scrapers/getLatestSharePrice_trade'
import getAllSharePricebyVolume from './scrapers/getLatestSharePrice_volume'
import companyFullNameScraper from './utils/companyFullNameScraperFn'
import getMarketInfo from './scrapers/getMarketInfo'

initializeApp()
const firestore = getFirestore()

// Scheduled function that runs every 2nd minute past every hour
// from 10 through 15 on every day-of-week from Sunday through Thursday.
exports.getAllStockTickers = pubsub
  .schedule('*/2 10-15 * * 0-4')
  .onRun(async () => {
    try {
      const stockData = await getLiveStockData()

      firestore.collection('stocks').add({
        timestamp: FieldValue.serverTimestamp(),
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

// Version 2 of the function >> using batch writes to firestore instead of add
// Scheduled function that runs every 2nd minute past every hour
// from 10 through 15 on every day-of-week from Sunday through Thursday.
exports.getAllStockTickersV2 = pubsub
  .schedule('*/10 10-15 * * 0-4')
  .onRun(async () => {
    try {
      const stockData = await getLiveStockData()

      const batch = firestore.batch()

      stockData.forEach(async (company) => {
        const ref = firestore.collection('stocksV2').doc(company.name)
        const priceRef = ref.collection('prices').doc()

        batch.set(
          priceRef,
          {
            current: company.prices.current,
            changed: company.prices.changed,
            changePercent: company.prices.changePercent,
            high: company.prices.high,
            low: company.prices.low,
            closep: company.prices.closep,
            ycp: company.prices.ycp,
            trade: company.prices.trade,
            value: company.prices.value,
            volume: company.prices.volume,
            timestamp: Timestamp.fromDate(new Date()),
          },
          { merge: true }
        )
      })

      await batch.commit()

      logger.info('Ran Function Successfully', {
        structuredData: true,
      })
      console.log(`Successfully scraped ${stockData.length} stocks`)
    } catch (error) {
      console.error(error)
      logger.error('Error scraping stock data', { error })
    }
  })

exports.getAllMarketInfo = pubsub
  .schedule('*/10 10-15 * * 0-4')
  .onRun(async () => {
    try {
      const marketInfo = await getMarketInfo()

      const batch = firestore.batch()

      marketInfo.forEach(async (market) => {
        const ref = firestore.collection('market-indexes').doc(market.indexName)
        const marketRef = ref.collection('marketData').doc()

        batch.set(
          marketRef,
          {
            indexName: market.indexName,
            indexValue: market.indexValue,
            indexChange: market.indexChange,
            indexChangePercent: market.indexChangePercent,
            timestamp: Timestamp.fromDate(new Date()),
          },
          { merge: true }
        )
      })

      await batch.commit()
      logger.info('Ran Function Successfully', { structuredData: true })
      console.log(`Successfully scraped ${marketInfo.length} market info`)
    } catch (error) {
      console.error(error)
      logger.error('Error scraping MarketInfo data', { error })
    }
  })

// Scheduled function that runs every friday at 10:00 AM to get the full name of the company for each stock trading code
// exports.addCompanyFullNameToDocument = pubsub
//   .schedule('0 10 * * 6')
//   .onRun(async () => {
//     try {
//       const companyData = await companyFullNameScraper(
//         'https://dsebd.org/latest_share_price_scroll_l.php'
//       )

//       const batch = firestore.batch()

//       companyData.forEach(async (company) => {
//         const ref = firestore.collection('stocksV2').doc(company.trading_code)

//         batch.set(ref, { fullName: company.name }, { merge: true })
//       })

//       await batch.commit()

//       logger.info('Ran Function Successfully', {
//         structuredData: true,
//       })
//       logger.info(`Added company full names ${companyData.length} stocks`)
//     } catch (error) {
//       console.error(error)
//       logger.error('Error scraping stock data', { error })
//     }
//   })

// HTTP function to manually get the full name of the company for each stock trading code
// exports.HTTPaddCompanyFullNameToDocument = https.onRequest(async (req, res) => {
//   try {
//     const companyData = await companyFullNameScraper(
//       'https://dsebd.org/latest_share_price_scroll_l.php'
//     )

//     const batch = firestore.batch()

//     companyData.forEach(async (company) => {
//       const ref = firestore.collection('stocksV2').doc(company.trading_code)

//       batch.set(ref, { fullName: company.name }, { merge: true })
//     })

//     await batch.commit()

//     logger.info('Ran Function Successfully', {
//       structuredData: true,
//     })

//     logger.info(`Added company full names ${companyData.length} stocks`)
//     res.send(companyData)
//   } catch (error) {
//     res.send(error)
//     console.error(error)
//     logger.error('Error scraping stock data', { error })
//   }
// })

// run the following functions if on local firebase emulator
// do not deploy these functions to production
if (
  process.env.FUNCTIONS_EMULATOR === 'true' ||
  process.env.FUNCTIONS_EMULATOR === '1'
) {
  // testing function using HTTPS method
  exports.getAllStockTickersNameHTTP = https.onRequest(async (req, res) => {
    try {
      const stockData = await getLiveStockData()

      const batch = firestore.batch()

      stockData.forEach(async (company) => {
        const ref = firestore.collection('stocks-v2').doc(company.name)
        const priceRef = ref.collection('prices').doc()

        batch.set(
          priceRef,
          {
            current: company.prices.current,
            changed: company.prices.changed,
            changePercent: company.prices.changePercent,
            high: company.prices.high,
            low: company.prices.low,
            closep: company.prices.closep,
            ycp: company.prices.ycp,
            trade: company.prices.trade,
            value: company.prices.value,
            volume: company.prices.volume,
            timestamp: Timestamp.fromDate(new Date()),
          },
          { merge: true }
        )
      })

      await batch.commit()

      logger.info('Ran Function Successfully', { structuredData: true })
      console.log(`Successfully scraped ${stockData.length} stocks`)
      res.send(Object.assign({}, stockData, { timestamp: Date.now() }))
    } catch (error) {
      logger.error('Unsuccessful Run', { structuredData: true })
      console.error(error)
      res.send(error)
    }
  })

  exports.getCurrentMarketInfoHTTP = https.onRequest(async (req, res) => {
    try {
      const marketInfo = await getMarketInfo()

      const batch = firestore.batch()

      marketInfo.forEach(async (market) => {
        const ref = firestore.collection('market-indexes').doc(market.indexName)
        const marketRef = ref.collection('marketData').doc()

        batch.set(
          marketRef,
          {
            indexName: market.indexName,
            indexValue: market.indexValue,
            indexChange: market.indexChange,
            indexChangePercent: market.indexChangePercent,
            timestamp: Timestamp.fromDate(new Date()),
          },
          { merge: true }
        )
      })

      await batch.commit()
      logger.info('Ran Function Successfully', { structuredData: true })
      console.log(`Successfully scraped ${marketInfo.length} market info`)

      res.send(marketInfo)
    } catch (error) {
      console.log(error)
    }
  })

  exports.addStockTradeCodeToDocument = https.onRequest(async (req, res) => {
    try {
      const stockData = await getLiveStockData()

      const batch = firestore.batch()

      stockData.forEach(async (company) => {
        const ref = firestore.collection('stocks-v2').doc(company.name)

        batch.set(ref, { name: company.name }, { merge: true })
      })

      await batch.commit()

      logger.info('Ran Function Successfully', { structuredData: true })
      console.log(`Successfully scraped ${stockData.length} stocks`)
      res.send(Object.assign({}, stockData, { timestamp: Date.now() }))
    } catch (error) {
      logger.error('Unsuccessful Run', { structuredData: true })
      console.error(error)
      res.send(error)
    }
  })

  exports.addCompanyFullNameToDocument = https.onRequest(async (req, res) => {
    try {
      const companyData = await companyFullNameScraper(
        'https://dsebd.org/latest_share_price_scroll_l.php'
      )

      const batch = firestore.batch()

      companyData.forEach(async (company) => {
        const ref = firestore.collection('stocks-v2').doc(company.trading_code)

        batch.set(ref, { fullName: company.name }, { merge: true })
      })

      await batch.commit()

      res.send(companyData)
    } catch (error) {
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
}
