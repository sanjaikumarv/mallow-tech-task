import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { User } from "@/types/user"
import axios from 'axios'
import { makeApiCall } from "@/lib/hooks"
interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
}

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await makeApiCall("/users?per_page=12", "GET")
})


export const createUser = createAsyncThunk("users/createUser", async (userData: Omit<User, "id">) => {
  return await makeApiCall("/users", "POST", userData)

})


export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }: { id: number; userData: Partial<User> }) => {
    return await makeApiCall(`/users/${id}`, "PUT", { id, ...userData });
  },
)

export const deleteUser = createAsyncThunk("users/deleteUser", async (id: number) => {
  return await makeApiCall<number>(`/users/${id}`, "DELETE", id)
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch users"
      })
      // Create user
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create user"
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload }
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update user"
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete user"
      })
  },
})

export const { clearError } = usersSlice.actions
export default usersSlice.reducer
