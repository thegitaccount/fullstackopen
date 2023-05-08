import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import { shortNotification } from '../reducers/notificationReducer'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote (state, action) {
      const { id } = action.payload
      return state.map(anecdote =>
        anecdote.id === id
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      ).sort((a, b) => b.votes - a.votes)
    },
    addAnecdote: (state, action) => {
      state.push(action.payload)
    },
    setAnecdotes: (state, action) => {
      return action.payload
    }
  }
})

export const { voteAnecdote, addAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const sortedAnecdotes = anecdotes.sort((a, b) => b.votes - a.votes)
    dispatch(setAnecdotes(sortedAnecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.create(content)
    dispatch(shortNotification('You added a new anecdote: \'' + content + '\'', 10))
    dispatch(addAnecdote(newAnecdote))
  }
}

export const voteAdd = (anecdote) => {
  //console.log(anecdote)
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.update(anecdote)
    dispatch(voteAnecdote(updatedAnecdote))
    dispatch(shortNotification('You voted: \'' + anecdote.content + '\'', 10))
  }
}

export default anecdoteSlice.reducer
