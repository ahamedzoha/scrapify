import axios from 'axios'
import { load } from 'cheerio'
import { MarketIndexData } from '../types'

const URL = `https://dsebd.org/index.php`

type GetMarketInfo = () => Promise<MarketIndexData>

const getMarketInfo: GetMarketInfo = async () => {
  try {
    const response = await axios.get(URL)
    const $ = load(response.data)
    const data: MarketIndexData = []
    $('div.col-md-6.col-xs-12.col-sm-12.LeftColHome').each((i, el) => {
      const indexName = $(el).find('div.m_col-1').text().trim()
      const indexValue = $(el).find('div.m_col-2').text().trim()
      const indexChange = $(el).find('div.m_col-3').text().trim()
      const indexChangePercent = $(el).find('div.m_col-4').text().trim()

      data.push({
        indexName: indexName,
        indexValue: parseFloat(indexValue),
        indexChange: parseFloat(indexChange),
        indexChangePercent: parseFloat(indexChangePercent),
      })
    })
    return data
  } catch (err) {
    return []
  }
}

const html = `
<body>
<div class="containbox">
<section class="content"> 
<div class="row white" style="padding-right: 0px !important; --bs-gutter-x: 0.8rem;">
<div class="col-md-6 col-xs-12 col-sm-12 LeftColHome ">
      <div class="_row">
        <h2 class="Bodyheading">Last update on Mar 07, 2023 at 3:10 PM </h2>
        <div class="midrow">
          <div class="m_col-1">DSE<font size="+1">X</font> Index</div>
          <div class="m_col-2"> 6262.31160 </div>
          <div class="m_col-3">
            2.83630          </div>
          <div class="m_col-4">
            0.04531%          </div>
          <div class="m_col-5"><img src="assets/images/upArrow.jpg"></div>
        </div>
        <div class="midrow" style="margin-top:1px;">
          <div class="m_col-1">DSE<font size="+1">S</font> Index</div>
          <div class="m_col-2"> 1361.57991 </div>
          <div class="m_col-3">
            -0.24903          </div>
          <div class="m_col-4">
            -0.01829%          </div>
          <div class="m_col-5"><img src="assets/images/downArrow.jpg"></div>
        </div>
        <div class="midrow" style="margin-top:1px;">
          <div class="m_col-1">DS30 Index</div>
          <div class="m_col-2"> 2225.88009 </div>
          <div class="m_col-3">
            -0.10150          </div>
          <div class="m_col-4">
            -0.00456%          </div>
          <div class="m_col-5"><img src="assets/images/downArrow.jpg"></div>
        </div>

        <div class="midrow mt10 mol_col-wid-cus">
          <div class="m_col-wid colorgreen">Total Trade</div>
          <div class="m_col-wid1 colorgreen">Total Volume</div>
          <div class="m_col-wid2 colorgreen">Total Value in Taka (mn)</div>
        </div>
        <div class="midrow mol_col-wid-cus" style="margin-top:1px;">
          <div class="m_col-wid colorlight">
            131915          </div>
          <div class="m_col-wid1 colorlight">
            95156914          </div>
          <div class="m_col-wid2 colorlight">
            6495.425          </div>
        </div>
        <div class="midrow mt10 mol_col-wid-cus">
          <div class="m_col-wid colorgreen">Issues Advanced</div>
          <div class="m_col-wid1 colorgreen">Issues declined</div>
          <div class="m_col-wid2 colorgreen">Issues Unchanged</div>
        </div>
        <div class="midrow mol_col-wid-cus" style="margin-top:1px;">
          <div class="m_col-wid colorlight">57</div>
          <div class="m_col-wid1 colorlight">110</div>
          <div class="m_col-wid2 colorlight">183</div>
        </div>
      </div>
    </div>
    </div>
    </section>
    </div>
</body>
// `
const data = [
  {
    indexName: 'DSEX',
    indexValue: 6262.3116,
    indexChange: 2.8363,
    indexChangePercent: 0.04531,
  },
  {
    indexName: 'DSES',
    indexValue: 1361.57991,
    indexChange: -0.24903,
    indexChangePercent: -0.01829,
  },
  {
    indexName: 'DS30',
    indexValue: 2225.88009,
    indexChange: -0.1015,
    indexChangePercent: -0.00456,
  },
]
export default getMarketInfo
