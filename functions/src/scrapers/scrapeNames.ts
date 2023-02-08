import axios from 'axios'
import { load } from 'cheerio'

const URL = 'https://www.dsebd.org/latest_share_price_scroll_by_volume.php'

interface TableRow {
  [key: string]: string | null
}

const html = `<table>
<tr>
    <td align="left">Market</td>
  </tr>
  <tr>
    <td align="left">Key 1</td>
    <td align="center">Value 1</td>
  </tr>
  <tr>
    <td align="left">Key 2</td>
    <td align="center">Value 2</td>
  </tr>
</table>`

// function
const getCompanyNames = async () => {
  try {
    const response = await axios.get(URL)
    const $ = load(response.data)
    // const $ = load(html)

    const tableData: TableRow[] = []

    // loops through each tr element
    $('table tr').each((i, el) => {
      const rowData: TableRow = {}

      // finds the number of td elements in the tr element
      const tds = $(el).find('td')

      // loops through each td element
      tds.each((j, td) => {
        // gets the value of the align attribute of the td element
        const align = $(td).attr('align')

        // if the align attribute is left, then the td element is a key
        if (align === 'left') {
          // sets the key of the rowData object to the text of the td element and
          // sets the value to null for now (will be set later)
          rowData[$(td).text() as string] = null

          // if the align attribute is center, then the td element is a value
          // and the key is the last key in the rowData object (the last key is the key of the previous td element)
          // and the value is the text of the td element (the value of the previous td element)
        } else if (align === 'center') {
          // gets the last key in the rowData object (the last key is the key of the previous td element)

          const key = Object.keys(rowData).pop()

          // sets the value of the rowData object to the text of the td element (the value of the previous td element)
          if (key) {
            // sets the value of the rowData object to the text of the td element (the value of the previous td element)
            rowData[key] = $(td).text() as string
          }
        }
      })

      // if the rowData object has any keys, then it is a valid row and is pushed to the tableData array
      if (Object.keys(rowData).length) {
        tableData.push(rowData)
      }
    })

    return tableData
  } catch (error) {
    console.log(error)
    return []
  }
}

export default getCompanyNames
