const Notification = ({ message }) => {
  console.log(message)
  if (message === null) {
    return null
  }

  const className = message.includes('Added') ? 'add' : 
    message.includes('Deleted') ? 'del' :
    message.includes('updated') ? 'update': 
    message.includes('Error') ? 'error': 'null'

  const fontSize = '20px'

  return (
    <div className={`notification ${className}`} style={{ fontSize }}>
      {message}
    </div>
  )
}

export default Notification
