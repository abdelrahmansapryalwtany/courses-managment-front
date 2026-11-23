import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 1. جلب كل الطلبات للأدمن (محمي بالتوكن)
export const fetchOrders = createAsyncThunk(
  "ordersSlice/fetchOrders",
  async (_, { getState }) => {
    const token = getState().auth.token;
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Unauthorized");
    return data.data.orders;
  },
);

// 2. تحديث حالة الطلب (محمي بالتوكن)
export const updateOrderStatus = createAsyncThunk(
  "ordersSlice/updateOrderStatus",
  async ({ orderId, status, note }, { getState }) => {
    const token = getState().auth.token;
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, note }),
      },
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Unauthorized");
    return data.data.order;
  },
);

const ordersSlice = createSlice({
  name: "ordersSlice",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (order) => order._id === action.payload._id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default ordersSlice.reducer;
