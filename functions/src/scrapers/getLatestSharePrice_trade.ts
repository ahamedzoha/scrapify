import marketHighlightsScraperFn from '../utils/marketHighlightsScraperFn'

const URL = `https://dsebd.org/latest_share_price_scroll_by_trade.php`

const getAllSharePricebyTrade = async () => {
  try {
    const response = await marketHighlightsScraperFn(URL)
    return response
  } catch (err) {
    return err
  }
}

export default getAllSharePricebyTrade
