const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => {
      console.log(error)
      response.status(500).send('Internal Server Error')
    })
})

blogsRouter.post('/', (request, response, next) => {
    //Tiene que tener la sintaxis del objeto
    const body = request.body
    console.log(body)
    if (!body.title|| !body.author || !body.url || !body.likes) {
        return response.status(400).json({
          error: 'content is missing'
        })
      }
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })
  
    blog.save()
      .then(savedBlog => {
        response.json(savedBlog)
      })
      .catch(error => {
        next(error)
        //console.log(error)
        //response.status(500).send('Internal Server Error');
      })
  })

module.exports = blogsRouter