import axios from 'axios'
import { load } from 'cheerio'

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

type DataType = {
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
type Data = DataType[]

const URL = `https://dsebd.org/latest_share_price_scroll_by_value.php`

const getAllSharePricebyValue = async () => {
  try {
    const response = await axios.get(URL)
    const $ = load(response.data)
    const data: Data = []
    $('div.table-responsive:nth-child(2) > table').each((i, el) => {
      const trading_code = $(el).find('a').text().trim()
      const ltp = $(el).find('td').eq(2).text().trim()
      const high = $(el).find('td').eq(3).text().trim()
      const low = $(el).find('td').eq(4).text().trim()
      const closep = $(el).find('td').eq(5).text().trim()
      const ycp = $(el).find('td').eq(6).text().trim()
      const change = $(el).find('td').eq(7).text().trim()
      const trade = $(el).find('td').eq(8).text().trim()
      const value = $(el).find('td').eq(9).text().trim()
      const volume = $(el).find('td').eq(10).text().trim()

      data.push({
        trading_code,
        ltp,
        high,
        low,
        closep,
        ycp,
        change,
        trade,
        value,
        volume,
      })
    })
    return data
  } catch (err) {
    return err
  }
}

export default getAllSharePricebyValue
