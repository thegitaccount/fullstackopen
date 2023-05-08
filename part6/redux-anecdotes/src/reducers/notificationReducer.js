import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      state = action.payload
      return state
    },
  },
})

export const { setNotification } = notificationSlice.actions

export const shortNotification = (message, delay) => {
  return (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(setNotification(null))
    }, delay * 1000)
  }
}

export default notificationSlice.reducer