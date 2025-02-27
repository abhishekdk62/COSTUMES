import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/common/Login";
import Home from "./pages/user/Home";
import SignUp from "./pages/user/Signup";
import PrivateRoute from "./protected/PrivateRoute";
import PublicRoute from "./protected/PublicRoute";
import React from 'react'

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/home"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
