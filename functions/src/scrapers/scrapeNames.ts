import marketHighlightsScraperFn from '../utils/marketHighlightsScraperFn'
const URL = 'https://www.dsebd.org/latest_share_price_scroll_l.php'

type Data = {
  index: number
  trading_code: string
  ltp: string
  high: string
  low: string
  closep: string
  ycp: string
  change: string
  trade: string
  value: string
  volume: string
}

// function
const getCompanyNames = async () => {
  try {
    const response = await marketHighlightsScraperFn(URL)
    const companyNames = response.map((company: Data) => company.trading_code)
    return companyNames
  } catch (error) {
    return error
  }
}

export default getCompanyNames
