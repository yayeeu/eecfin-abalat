
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoleGuard from "@/components/auth/RoleGuard";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ToastProvider } from "@/hooks/use-toast";

// Lazy-loaded components
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const Profile = lazy(() => import("./pages/Profile"));
const AddMember = lazy(() => import("./pages/AddMember"));
const FollowUps = lazy(() => import("./pages/FollowUps"));

// Configure the query client with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                
                {/* Auth Route */}
                <Route 
                  path="/auth" 
                  element={
                    <RoleGuard isPublicRoute={true}>
                      <Suspense fallback={<PageLoader />}>
                        <Auth />
                      </Suspense>
                    </RoleGuard>
                  } 
                />
                
                {/* Protected Routes */}
                <Route element={
                  <RoleGuard>
                    <Layout>
                      {/* This is where we need to pass the Outlet as children */}
                      <Suspense fallback={<PageLoader />} />
                    </Layout>
                  </RoleGuard>
                }>
                  {/* Admin Routes */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Admin />
                      </Suspense>
                    } 
                  />
                  
                  <Route 
                    path="/profile" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Profile />
                      </Suspense>
                    } 
                  />
                  
                  <Route 
                    path="/admin/add-member" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AddMember />
                      </Suspense>
                    } 
                  />
                  
                  <Route 
                    path="/admin/edit-member/:memberId" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AddMember />
                      </Suspense>
                    } 
                  />
                  
                  {/* Follow Ups Route */}
                  <Route 
                    path="/follow-ups" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <FollowUps />
                      </Suspense>
                    } 
                  />
                </Route>
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default AppRoutes;
