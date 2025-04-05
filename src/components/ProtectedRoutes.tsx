
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import Admin from "../pages/Admin";
import Profile from "../pages/Profile";
import AddMember from "../pages/AddMember";
import NotFound from "../pages/NotFound";
import Auth from "../pages/Auth";

const ProtectedRoutes = () => {
  return (
    <AuthRoute>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<Admin />} />
        <Route path="/admin/all-members" element={<Admin />} />
        <Route path="/admin/manage-ministries" element={<Admin />} />
        <Route path="/admin/add-member" element={<AddMember />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthRoute>
  );
};

export default ProtectedRoutes;
