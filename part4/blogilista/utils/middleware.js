const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET)
      const user = await User.findById(decodedToken.id)
      request.user = user
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' })
      } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' })
      } else {
        next(error)
      }
    }
  }
  next()
}



module.exports = {
  tokenExtractor,
  userExtractor
}