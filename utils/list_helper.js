const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    console.log('Tests of sum of likes')
    const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
    console.log('Total number of likes of array:', likes)
    return (
        likes
    )
}

const favouriteBlog = (blogs) => {
    console.log('Test of entry with highest n of likes')

    const favourite = blogs.reduce((previous, actual) => {
        if (previous.likes > actual.likes)
            return previous
        else
            return actual
    })

    /* console.log(favourite) */
    console.log('title ', favourite.title)
    console.log('author ', favourite.author)
    console.log('likes ', favourite.likes)
    console.log({
        title: favourite.title,
        author: favourite.author,
        likes: favourite.likes
    })
    return (
        /* favourite */
        {
            title: favourite.title,
            author: favourite.author,
            likes: favourite.likes
        }
    )
}

const mostBlogs = (blogs) => {

    //Obtiene un objeto/Version Lodash
    const blogsByAuthor = lodash.countBy(blogs, 'author')

    //Version sin lodash
    /* const blogsByAuthor = blogs.reduce((acc, blog) => {
        //Se accede al objeto con el acumulador, en la propiedad del nombre
        //Si existe el autor ,se devuelven sus instancias asociadas y se le suma 1, caso contrario devuelve 0 y se suma 1
        acc[blog.author] = (acc[blog.author] || 0) + 1
        return acc
    }, {}) */

    //Convierte el objeto a un arreglo que obtiene los valores y de ese el maximo. Se usa ... para analizar
    const maxValue = Math.max(...Object.values(blogsByAuthor))
    index = Object.values(blogsByAuthor).indexOf(maxValue)
    //Convierte el objeto en un arreglo y de eso obtener el nombre del autor
    const maxAuthor = Object.keys(blogsByAuthor)[index]

    console.log('Prueba LODASH')
    console.log(blogsByAuthor)
    console.log(maxValue)
    console.log(maxAuthor)
    console.log(
        {
            "author": maxAuthor,
            "blogs": maxValue
        }
    )

    return (
        {
            "author": maxAuthor,
            "blogs": maxValue
        }
    )
}

const mostLikes = (blogs) => {

    //Version lodash
    const likesByAuthor = lodash.reduce(blogs, (acc, blog) => {
        //Se accede al objeto con el acumulador, en la propiedad del nombre
        //Si existe el autor ,se devuelven sus likes asociados y se le suman, caso contrario devuelve 0 y se suman likes
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes
        //console.log(acc)
        return acc
    }, {})

    //Version sin Lodash
    /* const likesByAuthor = blogs.reduce((acc, blog) => {
        //Se accede al objeto con el acumulador, en la propiedad del nombre
        //Si existe el autor ,se devuelven sus likes asociados y se le suman, caso contrario devuelve 0 y se suman likes
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes
        console.log(acc)
        return acc
    }, {}) */

    //Maximo indice
    const maxLikes = Math.max(...Object.values(likesByAuthor))
    index = Object.values(likesByAuthor).indexOf(maxLikes)
    const maxAuthor = Object.keys(likesByAuthor)[index]

    console.log(maxAuthor)
    console.log(maxLikes)
    console.log(
        {
            "author": maxAuthor,
            "likes": maxLikes
        }
    )

    return (
        {
            "author": maxAuthor,
            "likes": maxLikes
        }
    )
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}