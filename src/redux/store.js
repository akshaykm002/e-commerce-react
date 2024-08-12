import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js";
import productsReducer from "./products/productsSlice.js";
import cartReducer from "./cart/cartSlice.js"; 
import ordersReducer from "./orders/orderSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        cart: cartReducer, 
        orders: ordersReducer
    },
});
