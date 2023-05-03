import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [Message, setMessage] = useState(null)
  const [user, setUser] = useState(null)




  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 1000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  const addBlog = async (title, author, url) => {
    try {
      const blog = await blogService.create({
        title,
        author,
        url
      })
      setBlogs(blogs.concat(blog))
      setMessage(`A new blog ${title} by ${author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (exception) {
      //console.log(exception)
      setMessage(`error: ${exception.message}`)
      setTimeout(() => {
        setMessage(null)
      }, 2000)
    }
  }

  const addLike = async (id, newObject) => {
    //console.log(newObject)
    try {
      const updatedBlog = await blogService.update(id, newObject)
      //console.log(updatedBlog)
      setBlogs(blogs.map(blog => blog.id === id ? { ...blog, likes: updatedBlog.likes } : blog))
      //console.log(blogs)
    } catch (exception) {
      setMessage('error' + exception.response)
      setTimeout(() => {
        setMessage(null)
      }, 2000)
    }
  }

  const deleteBlog = async (blogId) => {
    try {
      await blogService.remove(blogId)

      const updatedBlogs = blogs.filter((blog) => blog.id !== blogId)
      setBlogs(updatedBlogs)
      setMessage('Blog removed')
      setTimeout(() => {
        setMessage(null)
      }, 2000)
    } catch (exception) {
      setMessage('error' + exception.response)
      setTimeout(() => {
        setMessage(null)
      }, 2000)
    }
  }

  return (
    <div>
      <Notification message={Message} />
      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <div>
          <p>Logged in as {user.name}</p>
          <button style={{ fontWeight: 'bold' }} onClick={handleLogout}>
            Logout
          </button>
          <h1>Blogs</h1>
          <BlogForm addBlog={addBlog} />
          {sortedBlogs.map((blog) => (
            <div key={blog.id}>
              <Blog
                blog={blog}
                addLike={addLike}
                deleteBlog={deleteBlog}
                user={user}
              />
              <br />
            </div>
          ))}
        </div>
      )}
    </div>
  )

}

export default App