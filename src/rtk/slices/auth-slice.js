import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// دالة بسيطة لفك تشفير الـ JWT واستخراج البيانات (id, email, role)
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
};

const savedToken = localStorage.getItem("token") || null;
const savedUser = savedToken ? decodeToken(savedToken) : null;

// 1. تسجيل الدخول
export const loginUser = createAsyncThunk(
  "authSlice/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Invalid email or password");
      }

      const token = data.data.token;
      localStorage.setItem("token", token);
      return { token, user: decodeToken(token) };
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

// 2. إنشاء حساب جديد (يدعم رفع الصورة avatar عبر FormData)
export const registerUser = createAsyncThunk(
  "authSlice/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Registration failed");
      }

      const token = data.data.user.token;
      localStorage.setItem("token", token);
      return { token, user: decodeToken(token) };
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    token: savedToken,
    user: savedUser, // يحتوي على { id, email, role }
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
