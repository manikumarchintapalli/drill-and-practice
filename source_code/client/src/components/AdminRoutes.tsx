// src/components/AdminRoutes.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthenticatedUser } from '../lib/authUtils';

const AdminRoutes: React.FC = () => {
  const user = getAuthenticatedUser();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/sign-in" replace />;
  }
  return <Outlet />;
};

export default AdminRoutes;