import marketHighlightsScraperFn from '../utils/marketHighlightsScraperFn'
const URL = 'https://www.dsebd.org/latest_share_price_scroll_l.php'
import { CompanyDataType } from '../types'
// function
const getCompanyNames = async () => {
  try {
    const response = await marketHighlightsScraperFn(URL)
    const companyNames = response.map(
      (company: CompanyDataType) => company.trading_code
    )
    return companyNames
  } catch (error) {
    return error
  }
}

export default getCompanyNames
