
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminContent from '@/components/admin/AdminContent';

const Admin: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();

  // Update active section based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/dashboard') {
      setActiveSection('dashboard');
    } else if (path === '/admin/manage-members') {
      setActiveSection('manage_members');
    } else if (path === '/admin/all-members') {
      setActiveSection('members');
    } else if (path === '/admin/manage-ministries') {
      setActiveSection('ministries');
    }
  }, [location.pathname]);

  // Define which roles can access which sections
  const sectionAccess: Record<string, string[]> = {
    dashboard: ['admin', 'elder'],
    ministries: ['admin'],
    members: ['admin', 'elder'],
    manage_members: ['admin', 'elder'],
  };

  // If member role tries to access admin, redirect to home
  if (userRole === 'member') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-full">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Sidebar Component */}
          <AdminSidebar />

          {/* Main content area with header and content */}
          <div className="flex flex-col flex-1">
            {/* Header Component */}
            <AdminHeader />

            {/* Content Component */}
            <AdminContent 
              activeSection={activeSection}
            />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;
