const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  // eslint-disable-next-line quotes
  const passwordHash = await bcrypt.hash("hyvin_salainen", 10)
  await new User({ username: 'root', passwordHash }).save()
})

describe('User management tests:', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'Pappa',
      name: 'Paavo M Petäjä',
      password: 'aika_salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('proper statuscode & message if no username given', async () => {

    const newUser = {
      name: 'UKK',
      password: 'meikäläisensalasana'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('username` is required')
  })

  test('proper statuscode & message if username not unique', async () => {

    const newUser = {
      username: 'root',
      name: 'Paavo Väyrynen',
      password: 'kerranluulinolevaniväärässämuttaerehdyin'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('expected `username` to be unique')
  })


  test('proper statuscode & message if username too short', async () => {

    const newUser = {
      username: 'Uk',
      name: 'UKK',
      password: 'meikäläisensalasana'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('Username must be at least 3 characters')
  })

  test('proper statuscode & message if no password given', async () => {

    const newUser = {
      username: 'Ukki',
      name: 'UKK',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('Password is required')
  })

  test('proper statuscode & message if password too short', async () => {

    const newUser = {
      username: 'Ukki',
      name: 'UKK',
      password: 'mä'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('Password must be at least 3 characters long')
  })
})





afterAll(async () => {
  await mongoose.connection.close()
})