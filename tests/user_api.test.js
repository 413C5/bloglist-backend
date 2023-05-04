const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('cisco cisco', 10)
  const user = new User({
    username: 'admin admin',
    name: 'admin admin',
    passwordHash
  })

  await user.save()
})


describe('1.-User creation', () => {

  test('user creation successful', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'aaaaa aaaaa ',
      name: 'aaaaa aaaaa',
      password: 'aaaaa aaaaa',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user creation fails if username already in db', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'admin admin',
      name: 'admin admin',
      password: 'cisco cisco',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)


    const validationErrorMessage = 'Error, expected `username` to be unique.'
    expect(result.body.error).toContain(validationErrorMessage)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user creation fails if username < 3 char', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'b',
      name: 'bbbbbb bbbbb',
      password: 'bbbbb bbbbb'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const validationErrorMessage = 'username must be at least 3 characters long'
    expect(result.body.error).toContain(validationErrorMessage)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user creation fails if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'ccccc ccccc',
      password: 'ccccc ccccc'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const validationErrorMessage = 'username is missing'
    expect(result.body.error).toContain(validationErrorMessage)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user creation fails if name is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username:'fffff fffff',
      password: 'fffff fffff'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const validationErrorMessage = 'name is missing'
    expect(result.body.error).toContain(validationErrorMessage)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})

describe('2.-Password test', () => {

  test('user creation fails if password < 3 char', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ddddd ddddd',
      name: 'ddddd ddddd',
      password: 'd'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const validationErrorMessage = 'password must be at least 3 characters long'
    expect(result.body.error).toContain(validationErrorMessage)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user creation fails if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'eeeee eeeee',
      name: 'eeeee eeeee '
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const validationErrorMessage = 'password is missing'
    expect(result.body.error).toContain(validationErrorMessage)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })


})

afterAll(async () => {
  await mongoose.connection.close()
})