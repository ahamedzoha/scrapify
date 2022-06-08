require("dotenv").config()

const app = require("./app")

const PORT = process.env.PORT || 8006
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
