const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const PORT = process.env.PORT || 8006

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("dev"))

// Custom Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// TODO: deprecate endpoint without V1
app.use("/api/stocks", require("./routes/stockRoutes"))

// V1 URLs
app.use("/api/v1/stocks", require("./routes/stockRoutes"))
app.use("/api/v1/users", require("./routes/userRoutes"))

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
