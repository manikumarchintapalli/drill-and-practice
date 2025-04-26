// src/components/AdminLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminLayout: React.FC = () => (
  <>
    <AdminNavbar />
    <Outlet />
  </>
);

export default AdminLayout;