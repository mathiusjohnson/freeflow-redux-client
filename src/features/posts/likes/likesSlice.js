import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import axios from 'axios';

const url = 'http://localhost:8000/api/likes'

const likesAdapter = createEntityAdapter({
  // sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
})

const initialState = likesAdapter.getInitialState({
  status: 'idle',
  error: null,
})

export const fetchLikes = createAsyncThunk('likes/fetchLikes', async () => {
  const response = await axios.get('http://localhost:8000/api/likes');
  return response.data
})

export const addNewLike = createAsyncThunk(
  'likes/addNewLike',
  async (initialLikes) => {
    const { posting_id, liker_id} = initialLikes
    console.log("initial Likes in addnewLikes: ", initialLikes);
    const response = await axios.post(url, {like: posting_id, liker_id});
    console.log("response in thunk: ", response);
    return response.post
  }
)

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { likeId, reaction } = action.payload
      const existingLike = state.entities[likeId]
      if (existingLike) {
        existingLike.reactions[reaction]++
      }
    },
    // likeUpdated(state, action) {
    //   const { id, title, content } = action.payload
    //   const existingLike = state.entities[id]
    //   if (existingLike) {
    //     existingLike.title = title
    //     existingLike.content = content
    //   }
    // },
  },
  extraReducers: {
    [fetchLikes.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchLikes.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched likes to the array
      likesAdapter.upsertMany(state, action.payload)
    },
    [fetchLikes.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    [addNewLike.fulfilled]: likesAdapter.addOne,
  },
})

export const { likeAdded } = likesSlice.actions

export default likesSlice.reducer

export const {
  selectAll: selectAlllikes,
  selectById: selectLikeById,
} = likesAdapter.getSelectors((state) => state.likes)

export const selectLikesByPostId = createSelector(
  [selectAlllikes, (state, postOwnerId) => postOwnerId],
  (likes, postOwnerId) => likes.filter((like) => like.posting_id == postOwnerId)
)