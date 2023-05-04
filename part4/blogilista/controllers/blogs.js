const config = require('../utils/config')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')


logger.info(`Server running on port ${config.PORT}`)

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  const { title, author, url, likes } = request.body
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  //console.log('New blog posted by:', user.username)
  //console.log(`Token of ${user.username}:`, token)
  console.log(user)
  console.log(user.id)

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes || 0,
    user: user.id
  })
  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1, id: 1 })
    response.status(201).json(populatedBlog)
  } catch (error) {
    response.status(400).end()
  }

})

blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  const user = request.user
  //  console.log('Deletion made by:', user.username)
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const decodedToken = jwt.verify(token, config.SECRET)

  if (!(token && decodedToken.id)) {
    return response.status(401).json({ error: 'invalid token' })
  }

  try {
    const blog = await Blog.findById(id)

    if (blog.user.toString() === user.id.toString()) {
      await Blog.deleteOne({ _id: id })
      response.sendStatus(204).end()
    } else {
      return response.status(401).json({ error: 'unauthorized access' })
    }
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return response.status(400).json({ error: 'malformatted id' })
    } else {
      next(error)
    }
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, url, author, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,  { title, url, author, likes }, { new: true })

  response.json(updatedBlog)
})

module.exports = blogsRouter
