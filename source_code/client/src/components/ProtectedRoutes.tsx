// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { getAuthenticatedUser } from "../lib/authUtils";
// import Layout from "./Layout";

// const ProtectedRoutes = () => {
//   const user = getAuthenticatedUser();
//   const location = useLocation();

//   if (!user) {
//     return <Navigate to="/sign-in" replace />;
//   }

//   const isAdmin = user.role === "admin";
//   const pathname = location.pathname.toLowerCase();

//   const userOnlyPaths = ["/home", "/dashboard", "/practice", "/learn", "/solution", "/profile"];
//   const isTryingToAccessUserPages = userOnlyPaths.some((path) => pathname.startsWith(path));

//   if (isAdmin && isTryingToAccessUserPages) {
//     return <Navigate to="/admin/dashboard" replace />;
//   }

//   if (!isAdmin && pathname.startsWith("/admin")) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return (
//     <Layout>
//       <Outlet />
//     </Layout>
//   );
// };

// export default ProtectedRoutes;

// src/components/ProtectedRoutes.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Layout from './Layout';
import { getAuthenticatedUser } from '../lib/authUtils';

const ProtectedRoutes: React.FC = () => {
  const user = getAuthenticatedUser();
  const { pathname } = useLocation();

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  const isAdmin = user.role === 'admin';
  const userPaths = ['/home', '/dashboard', '/practice', '/learn', '/solution', '/profile'];
  const onUserPage = userPaths.some(p => pathname.startsWith(p));

  if (isAdmin && onUserPage) {
    return <Navigate to="/admin/question-manager" replace />;
  }
  if (!isAdmin && pathname.startsWith('/admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoutes;