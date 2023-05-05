const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')


//Select *
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

//Select ID
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog) 
    response.json(blog)
   
  else 
    response.status(404).end()
  

})

//Insert
blogsRouter.post('/', async (request, response) => {
  //Tiene que tener la sintaxis del objeto
  const body = request.body
  console.log(body)
  const user = await request.user

   if (!body.title || !body.author || !body.url) {
    return response.status(400).json({
      error: 'content is missing'
    })
  } 
 
  const likes = body.likes === undefined
    ? 0
    : body.likes

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: likes,
    user:user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

})

//Delete
blogsRouter.delete('/:id', async (request, response) => {
  const user = await request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({
      error: 'no permission'
    })
  }

})


//Update
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter