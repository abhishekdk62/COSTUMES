import { createSlice } from "@reduxjs/toolkit";

// Load data safely from localStorage
const loadFromLocalStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: loadFromLocalStorage("user"),
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token, role } = action.payload;

      // Update Redux state
      state.user = user;
      state.token = token;
      state.role = role;

      // Persist in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    },
    logout: (state) => {
      // Clear Redux state
      state.user = null;
      state.token = null;
      state.role = null;

      // Remove from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
