
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import WhoWeAre from "./pages/WhoWeAre";
import Constitution from "./pages/Constitution";
import OurFaith from "./pages/OurFaith";
import OurLeadership from "./pages/OurLeadership";
import Sermons from "./pages/Sermons";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import GetInvolved from "./pages/GetInvolved";
import Give from "./pages/Give";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import ManageMembers from "./pages/ManageMembers";
import FollowUps from "./pages/FollowUps";
import AddMember from "./pages/AddMember";
import MinistryManager from "./components/MinistryManager";
import NotFound from "./pages/NotFound";
import { Suspense } from "react";
import { useAuth } from "./contexts/AuthContext";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Toaster />
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/who-we-are" element={<Layout><WhoWeAre /></Layout>} />
            <Route path="/constitution" element={<Layout><Constitution /></Layout>} />
            <Route path="/our-faith" element={<Layout><OurFaith /></Layout>} />
            <Route path="/our-leadership" element={<Layout><OurLeadership /></Layout>} />
            <Route path="/sermons" element={<Layout><Sermons /></Layout>} />
            <Route path="/events" element={<Layout><Events /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/get-involved" element={<Layout><GetInvolved /></Layout>} />
            <Route path="/give" element={<Layout><Give /></Layout>} />
            <Route path="/auth" element={<Auth />} />

            <Route path="/admin" element={<ProtectedRoutes />}>
              <Route index element={<Admin />} />
              <Route path="profile" element={<Profile />} />
              <Route path="all-members" element={<ManageMembers />} />
              <Route path="follow-ups" element={<FollowUps />} />
              <Route path="edit-member/:id" element={<AddMember />} />
              <Route path="manage-ministries" element={<MinistryManager />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRoutes;
