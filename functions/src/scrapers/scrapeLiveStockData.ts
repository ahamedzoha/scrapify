import axios from 'axios'
import { load } from 'cheerio'
import { StockData } from '../types'
const URL = `https://www.dsebd.org/`

const getLiveStockData: () => Promise<StockData[]> = async () => {
  try {
    const resp = await axios.get(URL)
    const $ = load(resp.data)

    const stockData: StockData[] = []

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

    return stockData
  } catch (error) {
    console.log(error)
    return []
  }
}

export default getLiveStockData
