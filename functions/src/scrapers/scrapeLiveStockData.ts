import marketHighlightsScraperFn from '../utils/marketHighlightsScraperFn'
import { StockData } from '../types'
const URL = `https://dsebd.org/latest_share_price_scroll_l.php`

const getLiveStockData: () => Promise<StockData[]> = async () => {
  try {
    const response = await marketHighlightsScraperFn(URL)

    const stockData: StockData[] = []

    response.forEach((stock) => {
      stockData.push({
        name: stock.trading_code,
        prices: {
          current: stock.ltp,
          changed: stock.change,
          changePercent: findPercentageChange(stock.ltp, stock.change),
          high: stock.high,
          low: stock.low,
          closep: stock.closep,
          ycp: stock.ycp,
          trade: stock.trade,
          value: stock.value,
          volume: stock.volume,
        },
      })
    })

    return stockData
  } catch (error) {
    console.log(error)
    return []
  }
}

const findPercentageChange = (current: number, changedBy: number) => {
  // return upto 2 decimal places
  return parseFloat(((changedBy / current) * 100).toFixed(2))
}

export default getLiveStockData
