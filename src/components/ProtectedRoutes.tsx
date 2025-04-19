
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import Admin from "../pages/Admin";
import Profile from "../pages/Profile";
import AddMember from "../pages/AddMember";
import NotFound from "../pages/NotFound";
import ManageMembers from "../pages/ManageMembers";
import ContactLogs from "../pages/ContactLogs";

const ProtectedRoutes = () => {
  return (
    <AuthRoute>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<Admin />} />
        <Route path="/admin/all-members" element={<Admin />} />
        <Route path="/admin/manage-members" element={<Admin />} />
        <Route path="/admin/contact-logs" element={<Admin />} />
        <Route path="/admin/add-member" element={<AddMember />} />
        <Route path="/admin/edit-member/:memberId" element={<AddMember />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthRoute>
  );
};

export default ProtectedRoutes;

