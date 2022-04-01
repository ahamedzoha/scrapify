const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const PORT = process.env.PORT || 3000

const app = express()

const URL = `https://www.bproperty.com/en/bangladesh/properties-for-rent/`

axios
  .get(URL)
  .then((response) => {
    const html = response.data
    const $ = cheerio.load(html)
    const linksArray = []
    $(".ef447dde", html).each(function () {
      $(this).text()
      const links = `${URL.split("com")[0]}com` + $(this).find("a").attr("href")
      const title = $(this).find("a").attr("title")
      //   const title = $(this).find("span").
      linksArray.push({
        title,
        links,
      })
    })
    console.log(linksArray)
  })
  .catch((error) => {
    console.log(error)
  })

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
