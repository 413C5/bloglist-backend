const http = require('http')
const config = require('./utils/config')
const { request, response } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = config.MONGODB_URI

logger.info('connecting to', url)

mongoose.connect(url)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })


app.use(express.static('build'))

app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
app.use(middleware.unknownPath)

module.exports = app