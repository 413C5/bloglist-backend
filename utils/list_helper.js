const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    console.log('Tests')
    const likes=blogs.reduce((sum,blog)=> sum+blog.likes,0)
    console.log('Total number of likes of array:',likes)
    return(
        likes
    )
}

module.exports = {
    dummy,
    totalLikes
}