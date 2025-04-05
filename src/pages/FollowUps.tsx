
import React from 'react';
import AdminContent from '@/components/admin/AdminContent';
import FollowUpsList from '@/components/followups/FollowUpsList';
import MemberPageHeader from '@/components/members/MemberPageHeader';

const FollowUps: React.FC = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <MemberPageHeader 
        title="Follow Ups"
        description="Track and manage follow-ups with members"
      />
      <FollowUpsList />
    </div>
  );
};

export default FollowUps;
