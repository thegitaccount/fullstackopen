import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { shortNotification } from '../reducers/notificationReducer'



const AnecdoteList = () => {
  const anecdotes = useSelector((state) =>
    state.filter
      ? state.anecdotes.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
      )
      : state.anecdotes
  )
  const dispatch = useDispatch()


  const handleVote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    //console.log(anecdote)
    dispatch(shortNotification('You voted: \'' + anecdote.content + '\'', 5))


  }

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote)}>vote</button>
      </div>
    </div>
  ))
}

export default AnecdoteList
