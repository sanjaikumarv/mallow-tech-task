import { makeApiCall } from "@/lib/hooks"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

interface AuthState {
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await makeApiCall(
      "/login",
      "POST",
      { email, password },
    )
    if (!response.token) {
      throw new Error("Login failed: No token received")
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("token", response.token)
    }
    return response.token
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.error = null
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload
        state.error = null
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload)
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Login failed"
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
