import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get('http://localhost:4000/api/products');
  console.log("response data",response.data.products);
  return response.data.products;
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id) => {
  const response = await axios.get(`http://localhost:4000/api/products/${id}`);
  return response.data;
});

export const createProduct = createAsyncThunk('products/createProduct', async (product) => {
  const response = await axios.post('http://localhost:4000/api/products', product);
  return response.data;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, ...product }) => {
  const response = await axios.put(`http://localhost:4000/api/products/${id}`, product);
  return response.data;
});

export const searchProducts = createAsyncThunk('products/searchProducts', async (params) => {
  const { query, priceMin, priceMax, sortBy, sortOrder } = params;
  const response = await axios.get('http://localhost:4000/api/products/search', {
    params: { query, priceMin, priceMax, sortBy, sortOrder },
  });
  return response.data;
});

export const fetchSearchResults = createAsyncThunk('products/fetchSearchResults', async (query) => {
  const response = await axios.get(`http://localhost:4000/api/products/search?query=${query}`);
  return response.data;
});
  

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        console.log('Fetching products...');
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
        console.log('Fetched products:', state.products);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log('Error fetching products:', action.error.message);
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        );
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
