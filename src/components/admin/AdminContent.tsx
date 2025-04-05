
import React from 'react';
import { Card } from "@/components/ui/card";
import RoleGuard from '@/components/auth/RoleGuard';
import Dashboard from '@/components/Dashboard';
import MinistryManager from '@/components/MinistryManager';
import AllMembersList from '@/components/AllMembersList';

interface AdminContentProps {
  activeSection: string;
}

const AdminContent: React.FC<AdminContentProps> = ({ activeSection }) => {
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Church Dashboard';
      case 'ministries': return 'Manage Ministries';
      case 'members': return 'All Church Members';
      default: return '';
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'dashboard': 
        return 'Overview of church metrics, member statistics, and ministry activity.';
      case 'ministries': 
        return 'Add, edit, or delete ministry information displayed on the Get Involved page.';
      case 'members': 
        return 'View all church members, search/filter, and edit their information.';
      default: 
        return '';
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-eecfin-navy">
          {getSectionTitle()}
        </h1>
        <p className="text-gray-500 mt-2">
          {getSectionDescription()}
        </p>
      </div>
      
      {activeSection === 'dashboard' && (
        <RoleGuard allowedRoles={['admin', 'elder']}>
          <Dashboard />
        </RoleGuard>
      )}
      {activeSection === 'ministries' && (
        <RoleGuard allowedRoles={['admin']}>
          <MinistryManager />
        </RoleGuard>
      )}
      {activeSection === 'members' && (
        <RoleGuard allowedRoles={['admin', 'elder']}>
          <AllMembersList onMemberSelect={(id) => console.log(`Selected member: ${id}`)} />
        </RoleGuard>
      )}
    </div>
  );
};

export default AdminContent;
