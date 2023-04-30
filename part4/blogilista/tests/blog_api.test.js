const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')



beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})


describe('File management tests:', () => {

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have property "id" instead of "_id"', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
    // console.log(blog.id)
      expect(blog.id).toBeDefined()
    })
  })

  test('a valid blog can be added', async () => {

    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('admin12345', 10)
    const user = await new User({ username: 'admin', passwordHash }).save()

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(
      userForToken,
      process.env.SECRET,
      { expiresIn: 60*60 }
    )

    const newBlog =
      {
        'title': 'DD harms architecture',
        'author': 'Robert C. Martin',
        'url': 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        'likes': 99999,
      }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain(
      'DD harms architecture'
    )
  })

  test('default value for likes is 0 if not defined', async () => {

    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('admin12345', 10)
    const user = await new User({ username: 'admin', passwordHash }).save()

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(
      userForToken,
      process.env.SECRET,
      { expiresIn: 60*60 }
    )
    const newBlog =
      {
        'title' : 'First class tests',
        'author': 'Robert C. Martin',
        'url': 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
      }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
    expect(response.body.likes).toBe(0)
  })

  test('response is 400 Bad Request if title or url not defined', async () => {

    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('admin12345', 10)
    const user = await new User({ username: 'admin', passwordHash }).save()

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(
      userForToken,
      process.env.SECRET,
      { expiresIn: 60*60 }
    )
    const newBlog =
      {
        'author': 'Jokke Jokunen',
        'likes': 100
      }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('deleting a blog works', async () => {

    await Blog.deleteMany({})
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('admin12345', 10)
    const user = await new User({ username: 'admin', passwordHash }).save()

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(
      userForToken,
      process.env.SECRET,
      { expiresIn: 60*60 }
    )

    const newBlog =
    {
      'title': 'DD harms architecture',
      'author': 'Robert C. Martin',
      'url': 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      'likes': 99999,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]
    //console.log(blogToDelete.id)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('testing that the value of likes can be increased', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToUpdate = blogsAtStart[0]
    //console.log(blogToUpdate.likes)

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send( { likes: 1 }) // lähetetty arvo ei vaikuta lisäysten määrään tässä tapauksessa
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd[0].likes).toBe(
      helper.initialBlogs[0].likes + 1
    )
    //console.log(blogsAtEnd[0].likes)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have property "id" instead of "_id"', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
    // console.log(blog.id)
      expect(blog.id).toBeDefined()
    })
  })

  test('cannot add a blog without proper token', async () => {

    const newBlog =
      {
        'title': 'DD harms architecture',
        'author': 'Robert C. Martin',
        'url': 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        'likes': 99999,
      }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })


  afterAll(async () => {
    await mongoose.connection.close()
  })
})