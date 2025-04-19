
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
    } else if (path === '/admin/contact-logs') {
      setActiveSection('contact-logs');
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-6">
        <AdminContent activeSection={activeSection} />
      </div>
    </div>
  );
};

export default Admin;
