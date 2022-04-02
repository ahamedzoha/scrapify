const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const PORT = process.env.PORT || 3000

const app = express()

const URL = `https://www.dsebd.org/`

const stockData = []

axios
  .get(URL)
  .then((response) => {
    const html = response.data

    const $ = cheerio.load(html)

    const linksArray = []

    $(".abhead", html).each(function () {
      $(this).text()

      const companyName = $(this).text().split(" ")[0].trim()
      const currentPrice = $(this).text().split(" ")[0].trim()
      const change = $(this).text().trim()

      stockData.push({
        name: companyName,
        currentPrice: currentPrice,
        change: change,
      })
      console.log(stockData)
    })
  })
  .catch((error) => {
    console.log(error)
  })

app.get("/", (req, res) => {
  res.json(stockData)
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
