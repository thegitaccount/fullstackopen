const lodash = require("lodash")

const dummy = (blogs) => {
  if(blogs) {
    return 1
  }
}

const totalLikes = (blogs) => {

  if (blogs.length === 0) {
    return 0
  }
  else if (blogs.length === 1) {
    return blogs[0].likes
  }

  let total = 0
  for (let i = 0; i < blogs.length; i++) {
    total += blogs[i].likes
  }
  return total

}

const favoriteBlog = (blogs) => {

  const mostLiked = blogs.reduce((previous, current) => {
    return previous.likes > current.likes ? previous : current
  })

  return [
    {
      title: mostLiked.title,
      author: mostLiked.author,
      likes: mostLiked.likes,
    }
  ]
}

const mostBlogs = (blogs) => {

  const maxCount = lodash.countBy(blogs, 'author')

  const mostFrequentAuthor = Object.keys(maxCount).reduce((a, b) => {
    return maxCount[a] > maxCount[b] ? a : b
  })

  return [
    {
      author: mostFrequentAuthor,
      blogs: maxCount[mostFrequentAuthor]
    }
  ]
}

const mostLikes = (blogs) => {
  const likesCount = lodash(blogs)
    .groupBy('author')
    .map((objects, key) => ({
      author: key,
      likes: lodash.sumBy(objects, 'likes'),
    }))
    .value()
  const maxLikes = likesCount.reduce((a, b) => {
    return a.likes > b.likes ? a : b
  })
  return [maxLikes]
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}