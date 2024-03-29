import axios from 'axios'
import { load } from 'cheerio'
import { CompanyData } from '../types'

type MarketHighlightsScraperFn = (URL: string) => Promise<CompanyData>

const marketHighlightsScraperFn: MarketHighlightsScraperFn = async (
  URL: string
) => {
  try {
    const response = await axios.get(URL)
    const $ = load(response.data)
    const data: CompanyData = []
    $('div.table-responsive.inner-scroll  > table:nth-child(1) > tbody').each(
      (i, el) => {
        const index = i + 1
        const trading_code = $(el).find('a').text().trim()
        const ltp = $(el).find('td').eq(2).text().trim().replace(/,/g, '')
        const high = $(el).find('td').eq(3).text().trim().replace(/,/g, '')
        const low = $(el).find('td').eq(4).text().trim().replace(/,/g, '')
        const closep = $(el).find('td').eq(5).text().trim().replace(/,/g, '')
        const ycp = $(el).find('td').eq(6).text().trim().replace(/,/g, '')
        const change = $(el).find('td').eq(7).text().trim().replace(/,/g, '')
        const trade = $(el).find('td').eq(8).text().trim().replace(/,/g, '')
        const value = $(el).find('td').eq(9).text().trim().replace(/,/g, '')
        const volume = $(el).find('td').eq(10).text().trim().replace(/,/g, '')

        // console.log(trading_code)
        // console.log(ltp)
        // console.log(high)
        // console.log(low)
        // console.log(closep)
        // console.log(ycp)
        // console.log(change)
        // console.log(trade)
        // console.log(value)
        // console.log(volume)

        if (
          trading_code.length === 0 ||
          ltp.length === 0 ||
          high.length === 0 ||
          low.length === 0 ||
          closep.length === 0 ||
          ycp.length === 0 ||
          change.length === 0 ||
          trade.length === 0 ||
          value.length === 0 ||
          volume.length === 0
        ) {
          return
        } else {
          data.push({
            index: index,
            trading_code: trading_code,
            ltp: parseFloat(ltp),
            high: parseFloat(high),
            low: parseFloat(low),
            closep: parseFloat(closep),
            ycp: parseFloat(ycp),
            change: parseFloat(change),
            trade: parseFloat(trade),
            value: parseFloat(value),
            volume: parseFloat(volume),
          })
        }
      }
    )
    return data
  } catch (err) {
    return []
  }
}

export default marketHighlightsScraperFn

// const html = `
// <table
//   class="table table-bordered background-white shares-table fixedHeader"
//   style="table-layout: fixed; min-width: 711.5px"
// >
//   <colgroup>
//     <col style="width: 38px" />
//     <col style="width: 106.083px" />
//     <col style="width: 53.4px" />
//     <col style="width: 61.95px" />
//     <col style="width: 61.95px" />
//     <col style="width: 71.35px" />
//     <col style="width: 53.4px" />
//     <col style="width: 67.0667px" />
//     <col style="width: 56.3px" />
//     <col style="width: 69px" />
//     <col style="width: 72px" />
//   </colgroup>

//   <thead>
//     <tr class="size-row" aria-hidden="true" style="height: 51px">
//       <th class="floatThead-col" aria-label="#" style="height: 51px"></th>
//       <th
//         class="floatThead-col"
//         aria-label="TRADING CODE"
//         style="height: 51px"
//       ></th>
//       <th class="floatThead-col" aria-label="LTP*" style="height: 51px"></th>
//       <th class="floatThead-col" aria-label="HIGH" style="height: 51px"></th>
//       <th class="floatThead-col" aria-label="LOW" style="height: 51px"></th>
//       <th class="floatThead-col" aria-label="CLOSEP*" style="height: 51px"></th>
//       <th class="floatThead-col" aria-label="YCP*" style="height: 51px"></th>
//       <th class="floatThead-col" aria-label="CHANGE" style="height: 51px"></th>
//       <th class="floatThead-col" aria-label="TRADE" style="height: 51px"></th>
//       <th
//         class="floatThead-col"
//         aria-label="VALUE (mn)"
//         style="height: 51px"
//       ></th>
//       <th class="floatThead-col" aria-label="VOLUME" style="height: 51px"></th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr>
//       <td width="4%">1</td>
//       <td width="15%">
//         <a href="displayCompany.php?name=GENEXIL" class="ab1"> GENEXIL </a>
//       </td>
//       <td width="10%">106.2</td>
//       <td width="10%">109.9</td>
//       <td width="12%">105.9</td>
//       <td width="11%">106.2</td>
//       <td width="12%">108.1</td>
//       <td style="color: red" width="12%">-1.9</td>
//       <td width="11%">6,789</td>
//       <td class="background-yellow" width="11%">536.5740</td>
//       <td width="11%">4,967,526</td>
//     </tr>
//   </tbody>
//   <tbody>
//     <tr>
//       <td width="4%">2</td>
//       <td width="15%">
//         <a href="displayCompany.php?name=BSC" class="ab1"> BSC </a>
//       </td>
//       <td width="10%">142.2</td>
//       <td width="10%">143.8</td>
//       <td width="12%">139</td>
//       <td width="11%">142.2</td>
//       <td width="12%">140.4</td>
//       <td style="color: green" width="12%">1.8</td>
//       <td width="11%">3,903</td>
//       <td class="background-yellow" width="11%">404.5080</td>
//       <td width="11%">2,850,009</td>
//     </tr>
//   </tbody>
// </table>
// `

//  data = {[
//     {trading_code: "GENEXIL", ltp: "106.2", high: "109.9", low: "105.9", closep: "106.2", ycp: "108.1", change: "-1.9", trade: "6,789", value: "536.5740", volume: "4,967,526"},
//     {trading_code: "BSC", ltp: "142.2", high: "143.8", low: "139", closep: "142.2", ycp: "140.4", change: "1.8", trade: "3,903", value: "404.5080", volume: "2,850,009"},
//      ....
// ]}
