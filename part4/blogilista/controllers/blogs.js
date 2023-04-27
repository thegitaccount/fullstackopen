const config = require('../utils/config')
const logger = require('../utils/logger')

logger.info(`Server running on port ${config.PORT}`)

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})

blogsRouter.post('/', (request, response) => {

  const { title, author, url, likes } = request.body
  console.log(request.body)

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes
  })

  blog
    .save()
    .then(savedBlog => {
      response.json(savedBlog)
    })
})


module.exports = blogsRouter
