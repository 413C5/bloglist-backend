const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    author: {
        type: String,
        required: true,
        minlength: 5
    },
    url: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject._id
    }
})


module.exports = mongoose.model('Blog', blogSchema)
