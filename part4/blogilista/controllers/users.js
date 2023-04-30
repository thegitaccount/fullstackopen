const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const validatePassword = (password) => {
  if (!password) {
    const error = new Error('Password is required')
    error.name = 'ValidationError'
    error.statusCode = 400
    throw error
  }
  if (password.length < 3) {
    const error = new Error('Password must be at least 3 characters long')
    error.name = 'ValidationError'
    error.statusCode = 400
    throw error
  }
}

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  try {
    validatePassword(password)
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.use((error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
})


module.exports = usersRouter