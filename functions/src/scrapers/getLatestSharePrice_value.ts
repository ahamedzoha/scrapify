import marketHighlightsScraperFn from '../utils/marketHighlightsScraperFn'

const URL = `https://dsebd.org/latest_share_price_scroll_by_value.php`

const getAllSharePricebyValue = async () => {
  try {
    const response = await marketHighlightsScraperFn(URL)
    return response
  } catch (err) {
    return err
  }
}

export default getAllSharePricebyValue
