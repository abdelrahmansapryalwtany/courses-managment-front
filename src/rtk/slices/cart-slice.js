import { createSlice } from "@reduxjs/toolkit";

// جلب السلة المحفوظة من المتصفح إن وجدت
const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

const cartSlice = createSlice({
  name: "cart",
  initialState: savedCart,
  reducers: {
    // 1. إضافة منتج (أو زيادة كميته لو موجود مسبقاً)
    addToCart: (state, action) => {
      const findProduct = state.find(
        (product) => product._id === action.payload._id,
      );

      if (findProduct) {
        findProduct.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state));
    },

    // 2. إنقاص الكمية بواحد (وحذف المنتج لو وصلت الكمية 1 وضغطت ناقص)
    decreaseQuantity: (state, action) => {
      const findProduct = state.find(
        (product) => product._id === action.payload._id,
      );

      if (findProduct) {
        if (findProduct.quantity > 1) {
          findProduct.quantity -= 1;
        } else {
          const updated = state.filter(
            (product) => product._id !== action.payload._id,
          );
          localStorage.setItem("cart", JSON.stringify(updated));
          return updated;
        }
      }
      localStorage.setItem("cart", JSON.stringify(state));
    },

    // 3. حذف منتج بالكامل من السلة
    deleteFromCart: (state, action) => {
      const updated = state.filter(
        (product) => product._id !== action.payload._id,
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    },

    // 4. تفريغ السلة بالكامل
    clear: () => {
      localStorage.removeItem("cart");
      return [];
    },
  },
});

export const { addToCart, decreaseQuantity, deleteFromCart, clear } =
  cartSlice.actions;
export default cartSlice.reducer;
