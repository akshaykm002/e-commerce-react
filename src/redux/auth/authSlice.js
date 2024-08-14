import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk for logging in user
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    // First, log in the user
    const response = await axios.post('http://localhost:4000/api/login', credentials);
    const token = response.data.token;

    // Fetch user details using the token
    const userResponse = await axios.get('http://localhost:4000/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = userResponse.data.User;

    // Store token and user info in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('username', user.username);
    localStorage.setItem('userType', user.userType);
    localStorage.setItem('email', user.email);


    return { token, user };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Thunk for registering user
export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
  const response = await axios.post('http://localhost:4000/api/register', userData);
  return response.data;
});



const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    email: localStorage.getItem('email') || '',
    password: '',
    username: localStorage.getItem('username') || '',
    userType: localStorage.getItem('userType') || 'user',
    loading: false,
    error: null,
    message: null,
    success: null,
  },
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    setUserType(state, action) {
      state.userType = action.payload;
    },
    setAuth(state, action) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.userType = action.payload.userType;
    },
    logout(state) {
      state.token = null;
      state.email = '';
      state.password = '';
      state.username = '';
      state.userType = 'user';
      state.message = null;
      state.success = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userType');
      localStorage.removeItem('email');


    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.userType = action.payload.user.userType;
        state.username = action.payload.user.username;
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.success = action.payload.message;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
  },
});

export const { setEmail, setPassword, setUsername, setUserType, setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
