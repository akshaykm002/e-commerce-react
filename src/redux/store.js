import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice.js"
import productsReducer from "./products/productsSlice.js";

export const store = configureStore({
    reducer:{
        auth: authReducer,
        products:productsReducer
    }
})