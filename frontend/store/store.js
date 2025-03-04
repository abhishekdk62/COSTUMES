import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import searchReducer from "../slices/searchSlice"; // Import the search slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer, // Add it here
  },
});

export default store;
