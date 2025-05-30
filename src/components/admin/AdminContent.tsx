
import React from 'react';
import Dashboard from '@/components/Dashboard';
import AllMembersList from '@/components/AllMembersList';
import ManageMembers from '@/pages/ManageMembers';
import ContactLogs from '@/pages/ContactLogs';

interface AdminContentProps {
  activeSection: string;
}

const AdminContent: React.FC<AdminContentProps> = ({ activeSection }) => {
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Church Dashboard';
      case 'members': return 'All Church Members';
      case 'manage-members': return 'Manage Member Assignments';
      case 'contact-logs': return 'Contact Logs';
      default: return '';
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'dashboard': 
        return 'Overview of church metrics, member statistics, and ministry activity.';
      case 'members': 
        return 'View all church members, search/filter, and edit their information.';
      case 'manage-members':
        return 'Assign members to elders via drag and drop interface.';
      case 'contact-logs':
        return 'View and manage all elder-member contact history.';
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
      
      {activeSection === 'dashboard' && <Dashboard />}
      {activeSection === 'members' && (
        <AllMembersList onMemberSelect={(id) => console.log(`Selected member: ${id}`)} />
      )}
      {activeSection === 'manage-members' && <ManageMembers />}
      {activeSection === 'contact-logs' && <ContactLogs />}
    </div>
  );
};

export default AdminContent;

