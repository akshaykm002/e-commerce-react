import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:4000/api/login', credentials);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
  const response = await axios.post('http://localhost:4000/api/register', userData);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    email: '',
    password: '',
    username: '',
    userType: 'user', 
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
    logout(state) {
      state.token = null;
      state.email = '';
      state.password = '';
      state.username = '';
      state.userType = 'user';
      state.message = null;
      state.success = null;
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
      });
  },
});

export const { setEmail, setPassword, setUsername, setUserType, logout } = authSlice.actions;
export default authSlice.reducer;
