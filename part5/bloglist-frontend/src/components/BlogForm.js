import { useState } from 'react'


const BlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const handleAddBlog = (event) => {
    event.preventDefault()
    addBlog(newBlog.title, newBlog.author, newBlog.url)
    setNewBlog({ title: '', author: '', url: '' })
  }
  const [addBlogVisible, setAddBlogVisible] = useState(false)
  const hideWhenVisible = { display: addBlogVisible ? 'none' : '' }
  const showWhenVisible = { display: addBlogVisible ? '' : 'none' }


  return (

    <div>
      <div style={hideWhenVisible}>
        <button style={{ fontWeight: 'bold' }} onClick={() => setAddBlogVisible(true)}>Create new blog</button>
      </div>
      <div style={showWhenVisible}>
        <h2>Create new</h2>
        <form onSubmit={handleAddBlog}>
          <div>
            <label>title:</label>
            <input
              name="title"
              type="text"
              value={newBlog.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>author:</label>
            <input
              name="author"
              type="text"
              value={newBlog.author}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>url:</label>
            <input
              name="url"
              type="text"
              value={newBlog.url}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-buttons"></div>
          <button style={{ marginTop: '10px', fontWeight: 'bold' }} onClick={() => setAddBlogVisible(false)}>
            create
          </button>
        </form>
        <button style={{ marginBottom: '50px', fontWeight: 'bold' }} onClick={() => setAddBlogVisible(false)}>cancel</button>
      </div>
    </div>
  )
}

export default BlogForm