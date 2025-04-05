
import React from 'react';
import { Member } from '@/types/database.types';
import MembersTable from '@/components/members/MembersTable';
import MembersMap from '@/components/dashboard/MembersMap';
import { Button } from '@/components/ui/button';

interface MembersListContentProps {
  isLoading: boolean;
  filteredMembers: Member[];
  viewMode: string;
  onMemberClick: (memberId: string) => void;
  onViewDetails: (member: Member) => void;
  onEditMember: (memberId: string) => void;
  readOnly?: boolean;
  refetch: () => void;
  isError: boolean;
  totalCount: number;
  activeTabLabel: string;
}

const MembersListContent: React.FC<MembersListContentProps> = ({
  isLoading,
  filteredMembers,
  viewMode,
  onMemberClick,
  onViewDetails,
  onEditMember,
  readOnly = false,
  refetch,
  isError,
  totalCount,
  activeTabLabel
}) => {
  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading members data</p>
        <Button onClick={refetch} className="mt-4">Try Again</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-10 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
          <p className="mt-3">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {viewMode === 'list' ? (
        <div className="bg-white rounded-md border">
          <MembersTable 
            members={filteredMembers} 
            onMemberClick={onMemberClick}
            onViewDetails={onViewDetails}
            onEditMember={onEditMember}
            readOnly={readOnly}
          />
        </div>
      ) : (
        <MembersMap members={filteredMembers} />
      )}
      
      <div className="mt-2 text-sm text-gray-500">
        Showing {filteredMembers.length} {activeTabLabel !== 'all' ? activeTabLabel : 'of ' + totalCount + ' members'}
      </div>
    </div>
  );
};

export default MembersListContent;
