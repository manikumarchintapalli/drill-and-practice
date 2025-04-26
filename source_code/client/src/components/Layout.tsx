// import Navbar from "./Navbar";
// import AdminNavbar from "./AdminNavbar";
// import { getAuthenticatedUser } from "../lib/authUtils";
// import { useLocation } from "react-router-dom";

// const Layout = ({ children }) => {
//   const user = getAuthenticatedUser();
//   const location = useLocation();

//   const isAdminRoute = location.pathname.startsWith("/admin");
//   const isLandingPage = location.pathname === "/";

//   return (
//     <>
//       {!isLandingPage && (isAdminRoute && user?.role === "admin" ? <AdminNavbar /> : <Navbar />)}
//       <main className="page-container">{children}</main>
//     </>
//   );
// };

// export default Layout;

// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import AdminNavbar from './AdminNavbar';
import { getAuthenticatedUser } from '../lib/authUtils';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = getAuthenticatedUser();
  const { pathname } = useLocation();

  const isAdminRoute = pathname.startsWith('/admin');
  const isLandingPage = pathname === '/';

  if (isLandingPage) return <>{children}</>;

  return (
    <>
      {isAdminRoute && user?.role === 'admin' ? <AdminNavbar /> : <Navbar />}
      <main className="page-container">{children}</main>
    </>
  );
};

export default Layout;
