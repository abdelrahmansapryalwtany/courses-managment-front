import { createSlice } from "@reduxjs/toolkit";

const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: savedWishlist,
  reducers: {
    // إضافة أو إزالة المنتج بضغطة واحدة (Toggle)
    toggleWishlist: (state, action) => {
      const exists = state.find((item) => item._id === action.payload._id);
      let updated;
      if (exists) {
        updated = state.filter((item) => item._id !== action.payload._id);
      } else {
        updated = [...state, action.payload];
      }
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    },
    clearWishlist: () => {
      localStorage.removeItem("wishlist");
      return [];
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
