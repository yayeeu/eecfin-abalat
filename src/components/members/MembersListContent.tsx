
import React from 'react';
import { Member } from '@/types/database.types';
import { Loader2 } from 'lucide-react';
import MembersTable from '@/components/members/MembersTable';
import MemberLoadingState from './MemberLoadingState';
import MemberCard from './MemberCard';

interface MembersListContentProps {
  isLoading: boolean;
  isError: boolean;
  filteredMembers: Member[];
  viewMode: string;
  onMemberClick: (memberId: string) => void;
  onViewDetails: (member: Member) => void;
  onEditMember: (memberId: string) => void;
  readOnly?: boolean;
  totalCount: number;
  activeTabLabel: string;
  refetch?: () => void;
}

const MembersListContent: React.FC<MembersListContentProps> = ({
  isLoading,
  isError,
  filteredMembers,
  viewMode,
  onMemberClick,
  onViewDetails,
  onEditMember,
  readOnly = false,
  totalCount,
  activeTabLabel,
  refetch
}) => {
  if (isLoading) {
    return <MemberLoadingState />;
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading members</h3>
        <p className="mt-1 text-sm text-gray-500">
          Something went wrong while fetching members. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="my-4 text-sm text-gray-500">
        Showing {filteredMembers.length} of {totalCount} {activeTabLabel}
      </div>

      {viewMode === 'list' ? (
        <MembersTable
          members={filteredMembers}
          onMemberClick={onMemberClick}
          onViewDetails={onViewDetails}
          onEditMember={onEditMember}
          readOnly={readOnly}
          refetch={refetch}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onMemberClick={onMemberClick}
              onViewDetails={onViewDetails}
              onEditMember={onEditMember}
              readOnly={readOnly}
              refetch={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersListContent;
