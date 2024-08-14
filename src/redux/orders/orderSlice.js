import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/orders';

// Updated createOrder thunk to include payment details
export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, { getState }) => {
    const { auth } = getState();
    try {
        const response = await axios.post(API_URL, orderData, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        });
        return response.data;
    } catch (error) {
        return Promise.reject(error.response.data); 
    }
});
// Thunk to fetch all orders for the authenticated user
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { getState }) => {
    const { auth } = getState();
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        });
        return response.data; 
    } catch (error) {
        return Promise.reject(error.response.data); 
    }
});
const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        loading: false,
        error: null,
        paymentIntent: null, 
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.push(action.payload.order); 
                state.paymentIntent = action.payload.paymentIntent; 
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default orderSlice.reducer;
