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
      username: 'admin admin1',
      name: 'admin admin',
      password: 'cisco cisco',
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

})

/* afterAll(async () => {
  await mongoose.connection.close()
}) */
