const createUserVerify = (req, res, next) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      status: "error",
      message: "Please provide name and email",
    })
  } else {
    next()
  }
}

module.exports = {
  createUserVerify,
}
