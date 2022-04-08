const express = require("express")

const PORT = process.env.PORT || 8000

const app = express()

app.use("/api/stocks", require("./routes/stockRoutes"))

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
