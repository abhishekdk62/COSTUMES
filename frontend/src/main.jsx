import { createRoot } from "react-dom/client";
import React from 'react'
import { Provider } from "react-redux";  // Import Provider from Redux
import store from "../store/store.js";  // Import the Redux store
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>  {/* Wrap App with Provider */}
    <App />
    <ToastContainer />
  </Provider>
);
