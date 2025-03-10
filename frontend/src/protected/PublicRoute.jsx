import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const role = useSelector((state) => state.auth.role); // Assuming role is stored in Redux

    if (isAuthenticated&&role==="admin") {
        return  <Navigate to="/admin/users" replace /> 
    }

    return children;
};

export default PublicRoute;
