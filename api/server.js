require("dotenv").config()
const mongoose = require("mongoose")
const app = require("./app")

const DB = process.env.MONGO_CONNECT_STRING.replace(
  "<PASSWORD>",
  process.env.MONGO_DB_PASSWORD
)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    dbName: "stock-exchange",
  })
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((err) => {
    console.log(err)
  })

const PORT = process.env.PORT || 8006
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
