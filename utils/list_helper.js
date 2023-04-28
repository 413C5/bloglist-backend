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
    console.log('Favourite blog has ',favourite)
    return (
        favourite
    )
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}