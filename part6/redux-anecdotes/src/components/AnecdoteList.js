import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAdd, initializeAnecdotes } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector((state) =>
    state.filter
      ? state.anecdotes.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
      )
      : state.anecdotes
  )
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  const handleVote = (anecdote) => {
    dispatch(voteAdd(anecdote))
    //console.log(anecdote)
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
