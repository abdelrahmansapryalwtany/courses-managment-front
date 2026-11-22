import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cart-slice";
import productsReducer from "./slices/products-slice";
import oredersReducer from "./slices/orders-slice";
import authReducer from "./slices/auth-slice";
import wishlistReducer from "./slices/wishlist-slice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    orders: oredersReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
  },
});
