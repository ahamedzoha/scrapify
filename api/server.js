const app = require("./app")
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })

const PORT = process.env.PORT || 8006
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
