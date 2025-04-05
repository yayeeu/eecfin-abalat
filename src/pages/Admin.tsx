
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminContent from '@/components/admin/AdminContent';

const Admin: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const location = useLocation();

  // Update active section based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/dashboard') {
      setActiveSection('dashboard');
    } else if (path === '/admin/all-members') {
      setActiveSection('members');
    } else if (path === '/admin/manage-members') {
      setActiveSection('manage-members');
    } else if (path === '/admin/manage-ministries') {
      setActiveSection('ministries');
    }
  }, [location.pathname]);

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
