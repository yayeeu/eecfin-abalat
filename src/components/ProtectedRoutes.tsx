
import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import CustomLayout from "./CustomLayout";

// Admin pages
import Admin from "../pages/Admin";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

const ProtectedRoutes = () => {
  return (
    <AuthRoute>
      <CustomLayout>
        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CustomLayout>
    </AuthRoute>
  );
};

export default ProtectedRoutes;
