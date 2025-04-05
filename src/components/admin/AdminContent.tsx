
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RoleGuard from '@/components/auth/RoleGuard';
import Dashboard from '@/components/Dashboard';
import SliderManager from '@/components/slider/SliderManager';
import MinistryManager from '@/components/MinistryManager';
import MemberManager from '@/components/MemberManager';
import ElderManager from '@/components/ElderManager';

interface AdminContentProps {
  activeSection: string;
}

const AdminContent: React.FC<AdminContentProps> = ({ activeSection }) => {
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Church Dashboard';
      case 'ministries': return 'Manage Ministries';
      case 'members': return 'All Church Members';
      case 'elders': return 'Church Elders';
      case 'events': return 'Manage Events';
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
        return 'View all church members and their assigned roles.';
      case 'elders': 
        return 'View and manage church elders.';
      case 'events': 
        return 'Manage church events calendar and announcements.';
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
          <MemberManager />
        </RoleGuard>
      )}
      {activeSection === 'elders' && (
        <RoleGuard allowedRoles={['admin', 'elder']}>
          <ElderManager />
        </RoleGuard>
      )}
      {activeSection === 'events' && (
        <RoleGuard allowedRoles={['admin']}>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Events Management</h2>
            <p>Event management will be implemented soon.</p>
          </div>
        </RoleGuard>
      )}
    </div>
  );
};

export default AdminContent;
