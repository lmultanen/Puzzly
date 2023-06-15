import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPuzzlyImageUrl = createAsyncThunk(
    'image/fetchPuzzlyImageUrl',
    async (id) => {
        const { data } = await axios.get(`/api/image/${id}`);
        return data;
    }
);

export const fetchCurrentPuzzlyNumber = createAsyncThunk(
    'image/fetchCurrentPuzzlyNumber',
    async () => {
        const { data } = await axios.get('/api/image/currentpuzzly');
        return data
    }
)

export const fetchTotalPuzzlyCount = createAsyncThunk(
    'image/fetchTotalPuzzlyCount',
    async () => {
        const { data } = await axios.get(`/api/image`);
        return data
    }
)

const initialState = {
    imgUrl: null,
    puzzlyNumber: null,
    totalPuzzlyCount: null
}

const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchCurrentPuzzlyNumber.fulfilled, (state,action) => {
                state.puzzlyNumber = action.payload.dayDiff
            })
            .addCase(fetchPuzzlyImageUrl.fulfilled, (state, action) => {
                state.imgUrl = action.payload.imageUrl
            })
            .addCase(fetchTotalPuzzlyCount.fulfilled, (state,action) => {
                state.totalPuzzlyCount = action.payload.length
            })
    }
})

// export const {
//     setCurrentPuzzlyNumber,
//     setPuzzlyImageUrl
// } = imageSlice.actions

export default imageSlice.reducer