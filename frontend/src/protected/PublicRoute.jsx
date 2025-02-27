import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const token = useSelector((state) => state.auth.token);
    const role = useSelector((state) => state.auth.role); // Assuming role is stored in Redux

    if (token&&role==="admin") {
        return  <Navigate to="/admin/users" replace /> 
    }

    return children;
};

export default PublicRoute;
