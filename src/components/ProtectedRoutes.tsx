
import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import CustomLayout from "./CustomLayout";

// Admin pages
import Admin from "../pages/Admin";
import Profile from "../pages/Profile";
import ManageMembers from "../pages/ManageMembers";
import NotFound from "../pages/NotFound";

const ProtectedRoutes = () => {
  return (
    <AuthRoute>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/manage-members" element={<ManageMembers />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthRoute>
  );
};

export default ProtectedRoutes;
