import '../index.css'

const Notification = ({ message }) => {
  //console.log(message)
  if (message === null) {
    return null
  }

  const className = message.includes('wrong credentials') || message.includes('error') ? 'wrong' :
    message.includes('remove') ? 'remove' :
      message.includes('added') ? 'add' : 'null'

  const fontSize = '20px'


  return (
    <div className={`notification ${className}`} style={{ fontSize }}>
      {message}
    </div>
  )
}

export default Notification
