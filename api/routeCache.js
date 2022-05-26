const NodeCache = require("node-cache")
const cache = new NodeCache({
  checkperiod: 60,
  stdTTL: 10000,
  useClones: false,
})

module.exports = (duration) => (req, res, next) => {
  if (req.method !== "GET") {
    console.log("Not a GET request")
    return next()
  }

  const key = `${req.originalUrl}`
  const cachedResponse = cache.get(key)

  if (cachedResponse) {
    console.log(`HIT: Serving from cache: ${key}`)
    return res.status(200).send(cachedResponse)
  } else {
    console.log(`MISS: ${key}`)
    res.originalSend = res.send
    res.send = (body) => {
      res.originalSend(body)
      cache.set(key, body, duration)
    }
    next()
  }
}
