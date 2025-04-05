
import React from 'react';
import AdminContent from '@/components/admin/AdminContent';
import FollowUpsList from '@/components/followups/FollowUpsList';
import MemberPageHeader from '@/components/members/MemberPageHeader';

const FollowUps: React.FC = () => {
  return (
    <AdminContent>
      <MemberPageHeader 
        title="Follow Ups"
        description="Track and manage follow-ups with members"
      />
      <FollowUpsList />
    </AdminContent>
  );
};

export default FollowUps;
