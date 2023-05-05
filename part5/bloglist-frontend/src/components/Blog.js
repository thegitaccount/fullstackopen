import { useState } from 'react'

const Blog = ({ blog, addLike, deleteBlog, user }) => {
  //console.log(user)
  //console.log(blog)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    border: 'solid',
    display: 'inline-block', width: '700px',
    borderWidth: 1,
    marginTop: 5,
  }

  const [showDetails, setShowDetails] = useState(false)

  const handleLike = async () => {
  //console.log(blog.id)
    const newObject = { ...blog, likes: blog.likes + 1 }
    addLike(blog.id, newObject)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button style={{ fontWeight: 'bold', float: 'right' }} onClick={toggleDetails}>
          {showDetails ? 'Hide' : 'View'}
        </button>
      </div>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>
            {blog.likes}
            <button id='like-button' style={{ fontWeight: 'bold', float: 'right' }} onClick={handleLike}>
            Like
            </button>
          </p>
          <p>{blog.user.name}</p>
          {user && user.username === blog.user.username &&  (
            <button id='remove-button' style={{ backgroundColor: 'lightblue', fontWeight: 'bold' }} onClick={handleDelete}>
            Remove
            </button>
          )}
        </div>
      )}
    </div>
  )}

export default Blog