import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  userId: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { userId, role } = action.payload;
      state.isAuthenticated = true;
      state.userId = userId;
      state.role = role;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
