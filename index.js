const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const PORT = process.env.PORT || 3000

const app = express()

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
