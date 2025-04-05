
import React, { ReactNode } from 'react';
import Dashboard from '@/components/Dashboard';
import MinistryManager from '@/components/MinistryManager';
import AllMembersList from '@/components/AllMembersList';
import ManageMembers from '@/pages/ManageMembers';

interface AdminContentProps {
  activeSection?: string;
  children?: ReactNode;
}

const AdminContent: React.FC<AdminContentProps> = ({ activeSection, children }) => {
  // If children are provided, render them instead of determining content by activeSection
  if (children) {
    return <div className="flex-1 p-6">{children}</div>;
  }
  
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Church Dashboard';
      case 'ministries': return 'Manage Ministries';
      case 'members': return 'All Church Members';
      case 'manage-members': return 'Manage Member Assignments';
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
      case 'manage-members':
        return 'Assign members to elders via drag and drop interface.';
      default: 
        return '';
    }
  };

  return (
    <div className="flex-1 p-6">
      {activeSection && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-eecfin-navy">
            {getSectionTitle()}
          </h1>
          <p className="text-gray-500 mt-2">
            {getSectionDescription()}
          </p>
        </div>
      )}
      
      {activeSection === 'dashboard' && <Dashboard />}
      {activeSection === 'ministries' && <MinistryManager />}
      {activeSection === 'members' && (
        <AllMembersList onMemberSelect={(id) => console.log(`Selected member: ${id}`)} />
      )}
      {activeSection === 'manage-members' && <ManageMembers />}
    </div>
  );
};

export default AdminContent;
