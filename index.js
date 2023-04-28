const http = require('http')
require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')
const Blog = require('./models/blog')
const blog = require('./models/blog')
app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('--------------------------------------')
  next()
}

app.use(requestLogger)

//Devolucion todo
app.get('/api/blogs', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => {
      console.log(error)
      response.status(500).send('Internal Server Error')
    })
})

//Agregar nuevoss
app.post('/api/blogs', (request, response) => {
  //Tiene que tener la sintaxis del objeto
  const body = request.body
  console.log(body)

  if (body.title === undefined || body.author === undefined || body.url === undefined || body.likes === undefined) {
    return response.status(400).json({
      error: 'content is missing'
    })
  }
  const blog = Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog.save()
    .then(savedBlog => {
      response.json(savedBlog)
      console.log(savedBlog)
    })
    .catch(error => {
      console.log(error)
      response.status(500).send('Internal Server Error');
    })
})

const unknownPath = (request, response) => {
  response.status(404).json({
    error: 'unknown Path'
  })
}

app.use(unknownPath)

//En que puerto se atendera el servidor
const PORT = process.env.PORT

//

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
