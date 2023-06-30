import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllUsers = createAsyncThunk('admin/fetchAllUsers', 
    async (params) => {
        const token = window.localStorage.getItem('puzzlyToken');
        console.log("trying to fetch all users")
        if (token) {
            const { page } = params;
            // may later want different sort options
            // can add pagination later, just for now just want to view users
            const { data } = await axios.get('/api/user/allusers' + (page ? `?page=${page}` : ''), {
                headers: { authorization: token },
            });
            return data;
        }
});

// add in some thunks for adding/updating images later

const initialState = {
    allUsers: [],
    numUsers: NaN,
    status: 'idle',
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearAllUsersState: (state) => {
            state.allUsers = [];
            state.status = 'idle';
            state.numUsers = NaN;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAllUsers.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allUsers = action.payload.rows;
                state.numUsers = action.payload.count;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.status = 'failed';
            })
    }
})

export const { clearAllUsersState } = adminSlice.actions;

export default adminSlice.reducer;