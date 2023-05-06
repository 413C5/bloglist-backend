const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const logger = require('../utils/logger')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let testToken = null
let unvalidTestToken = null


beforeEach(async () => {

  await User
    .deleteMany({})

  await api
    .post('/api/users')
    .send(helper.initialUsers[0])

  await api
    .post('/api/login')
    .send(helper.testUserCredentials[0])
    .expect(response => { testToken = response.body.token })

  await Blog
    .deleteMany({})

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${testToken}`)
    .send(helper.initialBlogs[0])

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${testToken}`)
    .send(helper.initialBlogs[1])

})


describe('1.-Blogs are returned correctly:', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    expect(titles).toContain(
      'Canonical string reduction')
  })

  test('unique identifier property of the blog is named id', async () => {
    const blogs = await helper.blogsInDb()
    const blogKeys = Object.keys(blogs[0])
    const blogIds = blogs.map(r => r.id)

    expect(blogKeys).toContain('id')
    expect(blogKeys).not.toContain('_id')
    expect(blogIds[0]).toBeDefined()
  })

  test('returned blogs have properties title, author, url and likes', async () => {
    const blogs = await helper.blogsInDb()
    const blogKeys = Object.keys(blogs[0])

    expect(blogKeys).toContain('title')
    expect(blogKeys).toContain('author')
    expect(blogKeys).toContain('url')
    expect(blogKeys).toContain('likes')
  })

})



describe('2.-Viewing blogs:', () => {

  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
    expect(resultBlog.body).toEqual(processedBlogToView)
  })

  test('viewing a blog fails with 400 if id not valid', async () => {
    const invalidId = '5a3d5da59070081a82a3445rairai'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })

  test('viewing blog fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })


})



describe('3.-Adding blogs:', () => {

  test('a valid blog is added', async () => {

    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain(
      'Type wars')
  })


  test('a valid blog with 0 likes is added and has 0 likes', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const likes = blogsAtEnd.map(r => r.likes)
    expect(likes).toContain(0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('blog without author is not added', async () => {
    const newBlog = {
      title: 'First class tests',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })


  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })


  test('blog is not added without authorization token', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('4.-Deleting blogs:', () => {

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${testToken}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('blog is not deleted with unvalid authorization token', async () => {

    await api
      .post('/api/users')
      .send(helper.initialUsers[1])

    await api
      .post('/api/login')
      .send(helper.testUserCredentials[1])
      .expect(response => { unvalidTestToken = response.body.token })

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${unvalidTestToken}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain(blogToDelete.title)
  })
})


describe('5.-Updating blogs:', () => {

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      likes: 22
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${testToken}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const likes = blogsAtEnd.map(r => r.likes)
    expect(likes).not.toContain(blogToUpdate.likes)
    expect(likes).toContain(22)
  })

  test('blog is not updated with unvalid authorization token', async () => {

    await api
      .post('/api/users')
      .send(helper.initialUsers[1])

    await api
      .post('/api/login')
      .send(helper.testUserCredentials[1])
      .expect(response => { unvalidTestToken = response.body.token })


    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      likes: 22
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${unvalidTestToken}`)
      .send(updatedBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const likes = blogsAtEnd.map(r => r.likes)
    expect(likes).not.toContain(22)
    expect(likes).toContain(blogToUpdate.likes)
  })
})


afterAll(() => {
  mongoose.connection.close()
})