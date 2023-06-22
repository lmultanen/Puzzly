import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
	const token = window.localStorage.getItem('puzzlyToken');
	if (token) {
		const { data } = await axios.get('/api/user/account', {
			headers: { authorization: token },
		});
		return data;
	}
});

export const loginUser = createAsyncThunk(
	'user/login',
	async ({ login }, { rejectWithValue }) => {
		try {
			const { data } = await axios.post('/api/user/login', login);
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const createUser = createAsyncThunk(
	'user/createUser',
	async ({ signUp }) => {
		const { data: token } = await axios.post('/api/user/signup', signUp);
        console.log(token)
		return token;
	}
);

export const validateSignupForm = createAsyncThunk(
	'user/validateSignupForm',
	async ({ prop, value }) => {
		const { data } = await axios.post(`/api/user/userExists/${prop}`, {
			value,
		});
		return data;
	}
);
// refactor this later
// need to add in a validate route for this to work

export const addCurrentPuzzlyResult = createAsyncThunk(
    'user/addCurrentPuzzlyResult',
    async({ result }) => {
        const { data } = await axios.post('/api/user/addcurrentresult', {result})
        return data;
    }
)

export const addLocalPuzzlyResults = createAsyncThunk(
    'user/addLocalPuzzlyResults',
    async({ results }) => {
        const { data } = await axios.post('/api/user/addlocalresults', {results})
        return data;
    }
)

// friend thunks; might want to make a separate slice

export const fetchFriendsList = createAsyncThunk(
    'user/fetchFriendsList',
    async() => {
        const token = window.localStorage.getItem('puzzlyToken');
	    if (token) {    
            const { data } = await axios.get('/api/user/friends',{
                headers: { authorization: token },
            })
            return data;
        }
    }
)

export const addFriend = createAsyncThunk(
    'user/addFriend',
    async({ friend }) => {
        const token = window.localStorage.getItem('puzzlyToken');
	    if (token) {    
            const { data } = await axios.put('/api/user/addfriend', friend,{
                headers: { authorization: token },
            })
            return data;
        }
    }
)




const initialState = {
	userInfo: {},
    status: 'idle',
	isLoggedIn: false,
	isAdmin: false,
	error: null,
	token: null,
    formInputAvailable: { username: true },
    newFriendName: null,
    friends: []
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout: (state) => {
			window.localStorage.removeItem('puzzlyToken');
			state.userInfo = {};
			state.isLoggedIn = false;
			state.isAdmin = false;
			state.token = false;
		},
        setError: (state) => {
			state.error = null;
		},
        resetNewFriendName: (state) => {
            state.newFriendName = null
        }
	},
    extraReducers(builder) {
        builder
            .addCase(createUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log(action)
                window.localStorage.setItem('puzzlyToken',action.payload.token)
                state.token = action.payload.token
            })
            .addCase(createUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error;
			})
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
				state.userInfo = action.payload;
				state.isLoggedIn = action.payload ? true : false;
				state.token = localStorage.getItem('puzzlyToken');
				state.isAdmin = action.payload ? action.payload.isAdmin : false;
			})
            .addCase(fetchUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error;
			})
            .addCase(loginUser.fulfilled, (state, action) => {
				state.token = action.payload.token;
				localStorage.setItem('puzzlyToken', state.token);
			})
            .addCase(loginUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
            .addCase(validateSignupForm.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const field = action.payload.field;
				state.formInputAvailable[field] = action.payload.isAvailable;
			})
            .addCase(addCurrentPuzzlyResult.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.userInfo = action.payload
            })
            .addCase(addLocalPuzzlyResults.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.userInfo = action.payload
            })
            .addCase(addFriend.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.newFriendName = action.payload.username
                state.friends = action.payload.friends
                // do other stuff later
                // will resend friends list here
            })
            .addCase(addFriend.rejected, (state) => {
                state.status = 'failed';
                state.error = "User Not Found"
            })
            .addCase(fetchFriendsList.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.friends = action.payload
            })
    }
})

export const isLoggedStatus = (state) => state.user.isLoggedIn;
export const getUserToken = (state) => state.user.token;
export const getFormInputAvailable = (state) => state.user.formInputAvailable;
export const getError = (state) => state.user.error;
export const getNewFriendName = (state) => state.user.newFriendName;

export const { logout, setError, resetNewFriendName } = userSlice.actions;

export default userSlice.reducer;