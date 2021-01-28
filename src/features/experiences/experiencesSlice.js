import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import axios from 'axios';

const url = 'https://freeflow-two-point-o.herokuapp.com/api/experiences'

const experiencesAdapter = createEntityAdapter({
	selectId: (experience) => experience.id,
})

const initialState = experiencesAdapter.getInitialState({
  status: 'idle',
  error: null,
})

export const fetchExperiences = createAsyncThunk('experiences/fetchExperiences', async () => {
  const response = await axios.get(url);
  // console.log("fetched experiences: ", response.data);
  return response.data
})

export const getExperienceCountByUser = createAsyncThunk('experiences/getExperienceCount', async () => {
  const response = await axios.get('https://freeflow-two-point-o.herokuapp.com/api/experiences/user');
  // console.log("fetched experiences: ", response.data);
  return response.data	
})
export const addNewExperience = createAsyncThunk(
  'experiences/addNewExperience',
  async (initialExperiences) => {
    const { comment_id, giver_id} = initialExperiences
    // console.log("initial Experiences in addnewExperiences: ", initialExperiences);
    const response = await axios.post(url, {experience: comment_id, giver_id});
    // console.log("response in thunk: ", response);
    return response.post
  }
)

const experiencesSlice = createSlice({
  name: 'experiences',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { experienceId, reaction } = action.payload
      const existingExperience = state.entities[experienceId]
      if (existingExperience) {
        existingExperience.reactions[reaction]++
      }
    },
  },
  extraReducers: {
    [fetchExperiences.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchExperiences.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      experiencesAdapter.upsertMany(state, action.payload)
    },
    [fetchExperiences.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    [addNewExperience.fulfilled]: experiencesAdapter.addOne,
  },
})

export const { experienceAdded } = experiencesSlice.actions

export default experiencesSlice.reducer

export const {
  selectAll: selectAllExperiences,
  selectById: selectExperienceById,
  selectIds: selectExperienceIds,
} = experiencesAdapter.getSelectors((state) => {
	return state.experiences

}
 )

export const selectExperiencesByUserId = createSelector(
  [selectAllExperiences, (state, userId) => userId],
  (experiences, userId) => experiences.filter((experience) => {
		// console.log(experience, userId);
		return experience.helper_id == userId
	})
)