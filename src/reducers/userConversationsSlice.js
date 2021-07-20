// import {
//   createSlice
// } from '@reduxjs/toolkit'

// const initialState = ([])

// export let userConversationDB = {
//   '': ''
// }

// const userConversationSlice = createSlice({
//   name: 'userConversationDB',
//   initialState: initialState,
//   reducers: {
//     addUserConversation (state, action) {
//       console.log('action in add user conv: ', action.payload)
//       userConversationDB.push(action.payload)
//     },
//     setUserConversations (state, action) {
//       userConversationDB = action.payload
//       return action.payload
//     },
//     clearSelectedUser (state, action) {
//       console.log('payload in clear selected user: ', action.payload)
//       userConversationDB = userConversationDB.filter(conv => conv.name !== action.payload)
//       return userConversationDB
//     }
//   },
//   extraReducers: {
//   }
// })

// export const { addUserConversation, setUserConversations, clearSelectedUser } = userConversationSlice.actions

// export default userConversationSlice.reducer

import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter
  // createSelector,
} from '@reduxjs/toolkit'
import axios from 'axios'
// import { normalize, schema } from 'normalizr'

const url = 'https://freeflow-two-point-o.herokuapp.com/api/conversations'

// const conversationsAdapter = createEntityAdapter({
//   // sortComparer: (a, b) => a.time_sent.localeCompare(b.time_sent)
// })

export const fetchConversations = createAsyncThunk('conversations/fetchConversations', async (userId) => {
  const response = await axios.get(`${url}/${userId}`)
  return response.data
})

const initialState = {
  status: 'idle',
  error: null
}

const userConversationSlice = createSlice({
  name: 'userConversations',
  initialState,
  reducers: {
    setUserConversations (state, action) {
      // userConversationDB = action.payload.options[0]
      return action.payload
    },
    addUserConversation (state, action) {
      state.userConversations.messagers.push(action.payload)
      return state
    }
    // clearSelectedUser (state, action) {
    //   console.log('payload in clear selected user: ', action.payload)
    //   userConversationDB = userConversationDB.filter(conv => conv.name !== action.payload)
    //   return userConversationDB
    // }
  },
  extraReducers: {

    [fetchConversations.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchConversations.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      state.userConversations = action.payload
    },
    [fetchConversations.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    }
    // [addNewMessage.fulfilled]: conversationsAdapter.addOne,
    // [removeMessage.fulfilled]: (state, action) => {
    //   conversationsAdapter.removeOne(state, action.meta.arg.messageId)
    // }
  }
})

export const { setUserConversations, addUserConversation, emptyUserDB } = userConversationSlice.actions

export default userConversationSlice.reducer

export const selectAllConversations = state => state.userConversations
