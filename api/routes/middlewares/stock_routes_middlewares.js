const { initializeApp } = require("firebase/app")
const {
  getFirestore,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  where,
} = require("firebase/firestore")
const firebaseConfig = require("../../config")

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const stocksRef = collection(db, "stocks")

const checkCompany = async (req, res, next, val) => {
  let stockName = []

  const q = query(stocksRef, orderBy("timestamp", "desc"), limit(1))

  const Stocks = await getDocs(q)
  Stocks.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`)
    stockName.push(...doc.data().data.map((stock) => stock.name))
  })

  if (!stockName.includes(val)) {
    return res.status(400).json({
      error: "Invalid ID",
    })
  } else {
    next()
  }

  // res.status(200).send(stockName)
}

module.exports = {
  checkCompany,
}
