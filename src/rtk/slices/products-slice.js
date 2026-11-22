import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 1. جلب كل المنتجات أو حسب التصنيف
export const fetchProducts = createAsyncThunk(
  "productsSlice/fetchProducts",
  async ({ category = null, page = 1, limit = 10 } = {}) => {
    const url = category
      ? `${process.env.REACT_APP_API_URL}/api/products/category/${category}?page=${page}&limit=${limit}`
      : `${process.env.REACT_APP_API_URL}/api/products?page=${page}&limit=${limit}`;

    const res = await fetch(url);
    const data = await res.json();
    return data.data;
  },
);

// 2. جلب التصنيفات
export const fetchCategories = createAsyncThunk(
  "productsSlice/fetchCategories",
  async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/products/categories`,
    );
    const data = await res.json();
    return data.data.categories;
  },
);

// 3. جلب منتج واحد (لصفحة التعديل والتفاصيل)
export const fetchSingleProduct = createAsyncThunk(
  "productsSlice/fetchSingleProduct",
  async (productId) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
    );
    const data = await res.json();
    return data.data.product;
  },
);
// 4. إضافة منتج جديد (محمي بالتوكن)
export const addProduct = createAsyncThunk(
  "productsSlice/addProduct",
  async (formData, { getState }) => {
    const token = getState().auth.token;
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Unauthorized");
    return data.data.product;
  },
);

// 5. تعديل منتج موجود (محمي بالتوكن)
export const updateProduct = createAsyncThunk(
  "productsSlice/updateProduct",
  async ({ productId, formData }, { getState }) => {
    const token = getState().auth.token;
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Unauthorized");
    return data.data.product;
  },
);

// 6. حذف منتج (محمي بالتوكن)
export const deleteProduct = createAsyncThunk(
  "productsSlice/deleteProduct",
  async (productId, { getState }) => {
    const token = getState().auth.token;
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Unauthorized");
    }
    return productId;
  },
);

const productsSlice = createSlice({
  name: "productsSlice",
  initialState: {
    items: [],
    categories: [],
    selectedProduct: null,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    submitting: false, // لحالة زر الحفظ أثناء الإرسال
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // جلب المنتجات
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      })

      // جلب التصنيفات
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      // جلب منتج واحد
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state) => {
        state.loading = false;
      })

      // إضافة منتج
      .addCase(addProduct.pending, (state) => {
        state.submitting = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.submitting = false;
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(addProduct.rejected, (state) => {
        state.submitting = false;
      })

      // تعديل منتج
      .addCase(updateProduct.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.submitting = false;
        if (action.payload) {
          const index = state.items.findIndex(
            (item) => item._id === action.payload._id,
          );
          if (index !== -1) state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state) => {
        state.submitting = false;
      })
      // حذف منتج
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (product) => product._id !== action.payload,
        );
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
