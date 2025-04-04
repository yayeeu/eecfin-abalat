
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth.types';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminContent from '@/components/admin/AdminContent';

interface AdminProps {
  activeSection?: string;
}

const Admin: React.FC<AdminProps> = ({ activeSection = 'dashboard' }) => {
  const [activeSectionState, setActiveSection] = useState<string>(activeSection);
  const navigate = useNavigate();
  const { userRole, signOut, signUp } = useAuth();

  const handleMenuClick = (id: string) => {
    // Special case for the 'manage_members' item which has a direct URL
    if (id === 'manage_members') {
      navigate('/manage-members');
      return;
    }
    
    // Check if user has access to this section
    if (userRole && (userRole === 'admin' || sectionAccess[id]?.includes(userRole))) {
      setActiveSection(id);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Define which roles can access which sections based on requirements
  const sectionAccess: Record<string, UserRole[]> = {
    dashboard: ['admin', 'elder'],
    slider: ['admin', 'it', 'volunteer'],
    ministries: ['admin'],
    members: ['admin', 'elder'],
    settings: ['admin'],
    auth: ['admin', 'member', 'elder', 'it', 'volunteer'],
    register: ['admin'], // Only admin can access member registration
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
          <AdminSidebar 
            userRole={userRole}
            activeSectionState={activeSectionState}
            handleMenuClick={handleMenuClick}
            handleSignOut={handleSignOut}
          />

          {/* Main content area with header and content */}
          <div className="flex flex-col flex-1">
            {/* Header Component */}
            <AdminHeader />

            {/* Content Component */}
            <AdminContent 
              activeSection={activeSectionState} 
              signUp={signUp} 
            />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;
