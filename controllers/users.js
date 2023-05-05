const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//Select *
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

  response.json(users)
})

//Select id
usersRouter.get('/:id', async (request, response) => {
  const user = await User
    .findById(request.params.id)
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

  if (user) {
    response.json(user)
  } 
  else {
    response.status(404).end()
  }

})


//Insert
usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.username) {
    return response.status(400).json({
      error: 'username is missing'
    })
  }

  if (body.username.length < 3) {
    return response.status(400).json({
      error: 'username must be at least 3 characters long'
    })
  }

  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!body.passwordHash) {
    return response.status(400).json({
      error: 'passwordHash is missing'
    })
  }

  if (body.passwordHash.length < 3) {
    return response.status(400).json({
      error: 'passwordHash must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.passwordHash, saltRounds)

  const user = new User({
    username:body.username,
    name:body.username,
    passwordHash:passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter