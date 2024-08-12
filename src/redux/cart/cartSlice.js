import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:4000/api/cart';

// Thunk to fetch the user's cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState }) => {
  const { auth } = getState();
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  return response.data.cartItems;
});

// Thunk to add an item to the cart
export const addToCart = createAsyncThunk('cart/addToCart', async (itemData, { getState }) => {
  const { auth } = getState();
  const response = await axios.post(API_URL, itemData, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  return response.data.cartItem;
});

// Thunk to update an item in the cart
export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ id, quantity }, { getState }) => {
  const { auth } = getState();
  const response = await axios.put(`${API_URL}/${id}`, { quantity }, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  return response.data.updatedCartItem;
});

// Thunk to remove an item from the cart
export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (id, { getState }) => {
  const { auth } = getState();
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  return id;
});

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // Check if the item already exists in the cart
        const existingItem = state.cartItems.find(item => item.id === action.payload.id);
        if (existingItem) {
          // Update quantity if the item already exists
          existingItem.quantity += action.payload.quantity;
        } else {
          // Otherwise, add the new item
          state.cartItems.push(action.payload);
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.cartItems.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.cartItems[index].quantity = action.payload.quantity;
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
