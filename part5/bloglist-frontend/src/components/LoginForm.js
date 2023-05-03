import { useState } from 'react'
import PropTypes from 'prop-types'


const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    console.log('username:', username, 'password:', password)
    handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return (

    <div>
      <h2>Log in to application</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label style={{ width: '80px' }}>username:</label>
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            style={{ width: '200px' }}
          />
        </div>
        <div>
          <label style={{ width: '80px' }}>password:</label>
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            style={{ width: '200px' }}
          />
        </div>
        <button type="submit">
          login
        </button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
}

export default LoginForm