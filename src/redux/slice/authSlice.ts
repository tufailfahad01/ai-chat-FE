import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("token"), 
  loading: false,
  error: null,
};

// 🔹 Login User Thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("auth/login", payload);

      localStorage.setItem("token", response?.data?.data?.token);
      return response?.data?.data;
    } catch (error: unknown) {
      return rejectWithValue(error || "An error occurred");
    }
  }
);

// 🔹 Register User Thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    payload: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("Registering user", JSON.stringify(payload));
      const { data } = await api.post("auth/register", payload);
      return data;
    } catch (error: unknown) {
      return rejectWithValue(error || "An error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    initializeAuth: (state) => {
      state.isAuthenticated = !!localStorage.getItem("token"); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
