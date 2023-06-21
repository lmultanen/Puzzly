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
	'user/loginUser',
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

const initialState = {
	userInfo: {},
	isLoggedIn: false,
	isAdmin: false,
	error: null,
	token: null,
    formInputAvailable: { username: true }
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout: (state) => {
			window.localStorage.removeItem('puzzlyToken');
			state.userInfo = {};
			state.isLogged = false;
			state.isAdmin = false;
			state.token = false;
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
            .addCase(fetchUser.fulfilled, (state, action) => {
				state.userInfo = action.payload;
				state.isLoggedIn = action.payload ? true : false;
				state.token = localStorage.getItem('puzzlyToken');
				state.isAdmin = action.payload ? action.payload.isAdmin : false;
			})
            .addCase(loginUser.fulfilled, (state, action) => {
				state.token = action.payload.token;
				localStorage.setItem('puzzlyToken', state.token);
			})
            .addCase(validateSignupForm.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const field = action.payload.field;
				state.formInputAvailable[field] = action.payload.isAvailable;
			})
    }
})

export const isLoggedStatus = (state) => state.user.isLogged;
export const getUserToken = (state) => state.user.token;
export const getFormInputAvailable = (state) => state.user.formInputAvailable;

export const { logout } = userSlice.actions;

export default userSlice.reducer;