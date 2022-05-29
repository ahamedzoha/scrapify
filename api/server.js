const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const PORT = process.env.PORT || 8006

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("combined"))
app.use("/api/stocks", require("./routes/stockRoutes"))

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
