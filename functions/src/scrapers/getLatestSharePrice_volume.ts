import marketHighlightsScraperFn from '../utils/marketHighlightsScraperFn'

const URL = `https://dsebd.org/latest_share_price_scroll_by_volume.php`

const getAllSharePricebyVolume = async () => {
  try {
    const response = await marketHighlightsScraperFn(URL)
    return response
  } catch (err) {
    return err
  }
}

export default getAllSharePricebyVolume
