
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth.types";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoleGuard from "@/components/auth/RoleGuard";

// Lazy-loaded components for better initial loading performance
const WhoWeAre = lazy(() => import("./pages/WhoWeAre"));
const OurFaith = lazy(() => import("./pages/OurFaith"));
const OurLeadership = lazy(() => import("./pages/OurLeadership"));
const Events = lazy(() => import("./pages/Events"));
const Contact = lazy(() => import("./pages/Contact"));
const GetInvolved = lazy(() => import("./pages/GetInvolved"));
const Sermons = lazy(() => import("./pages/Sermons"));
const Give = lazy(() => import("./pages/Give"));
const Constitution = lazy(() => import("./pages/Constitution"));
const Admin = lazy(() => import("./pages/Admin"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const ManageMembers = lazy(() => import("./pages/ManageMembers"));

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

// Loading fallback for lazy-loaded components
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
  </div>
);

// Define public routes and protected routes
const publicRoutes = [
  { path: "/", element: <Index /> },
  { path: "/who-we-are", element: <WhoWeAre /> },
  { path: "/our-faith", element: <OurFaith /> },
  { path: "/our-leadership", element: <OurLeadership /> },
  { path: "/events", element: <Events /> },
  { path: "/sermons", element: <Sermons /> },
  { path: "/contact", element: <Contact /> },
  { path: "/get-involved", element: <GetInvolved /> },
  { path: "/give", element: <Give /> },
  { path: "/constitution", element: <Constitution /> }
];

const protectedRoutes = [
  { 
    path: "/admin", 
    element: <Admin />, 
    roles: ['admin', 'member', 'elder', 'it', 'volunteer'] as UserRole[] 
  },
  { 
    path: "/profile", 
    element: <Profile />, 
    roles: ['admin', 'member', 'elder', 'it', 'volunteer'] as UserRole[] 
  },
  {
    path: "/manage-members",
    element: <ManageMembers />,
    roles: ['admin', 'elder'] as UserRole[]
  }
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            {publicRoutes.map(route => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={
                  route.path === "/" ? (
                    route.element
                  ) : (
                    <Layout>
                      <Suspense fallback={<PageLoader />}>
                        <RoleGuard isPublicRoute={true}>
                          {route.element}
                        </RoleGuard>
                      </Suspense>
                    </Layout>
                  )
                } 
              />
            ))}

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

            {/* Admin Route - Without Layout component */}
            <Route 
              path="/admin" 
              element={
                <RoleGuard allowedRoles={['admin', 'elder', 'it', 'volunteer']}>
                  <Suspense fallback={<PageLoader />}>
                    <Admin />
                  </Suspense>
                </RoleGuard>
              } 
            />

            {/* Profile Route */}
            <Route 
              path="/profile" 
              element={
                <RoleGuard allowedRoles={['admin', 'member', 'elder', 'it', 'volunteer']}>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <Profile />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              } 
            />

            {/* Manage Members Route */}
            <Route 
              path="/manage-members" 
              element={
                <RoleGuard allowedRoles={['admin', 'elder']}>
                  <Suspense fallback={<PageLoader />}>
                    <ManageMembers />
                  </Suspense>
                </RoleGuard>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
