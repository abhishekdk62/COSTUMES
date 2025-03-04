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
      const { token, user, role } = action.payload;
      if (token !== undefined) {
        state.token = token;
        localStorage.setItem("token", token);
      }
      if (user !== undefined) {
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
      }
      if (role !== undefined) {
        state.role = role;
        localStorage.setItem("role", role);
      }
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
