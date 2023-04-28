//mongodb+srv://fullstack:<password>@cluster0.ezwn4oa.mongodb.net/?retryWrites=true&w=majority

const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('ERROR, need provide password : node mongo.js <password>')
    process.exit(1)
}

if (process.argv.length < 5) {
    console.log('ERROR, need provide blog content : node mongo.js <password> <title> <author> <url> <likes>')
    process.exit(1)
}

const password = process.argv[2]
const title=process.argv[3]
const author=process.argv[4]
const urll=process.argv[5]
const likes=process.argv[6]

const url = `mongodb+srv://fullstack:${password}@cluster0.ezwn4oa.mongodb.net/app-bloglist?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog= mongoose.model('Blog',blogSchema)

const blog=new Blog({
    title: title,
    author: author,
    url: urll,
    likes: likes
})

//Insert
blog.save().then(result=>{
    console.log('blog saved!')
    console.log(result)
    mongoose.connection.close()
})

//Select
/* Blog.find({}).then(result=>{
    result.forEach(blog => {
        console.log(blog)
    })
    mongoose.connection.close()
}) */