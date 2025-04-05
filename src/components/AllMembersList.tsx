
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllMembers } from '@/lib/memberService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import MembersTable from '@/components/members/MembersTable';
import MembersMap from '@/components/dashboard/MembersMap';

interface AllMembersListProps {
  onMemberSelect: (memberId: string) => void;
  readOnly?: boolean;
  searchTerm?: string;
  viewMode?: string;
}

const AllMembersList = ({ 
  onMemberSelect, 
  readOnly = false,
  searchTerm = '',
  viewMode = 'list'
}: AllMembersListProps) => {
  const { toast } = useToast();

  // Query to fetch all members, including those without user accounts
  const { 
    data: members = [], 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['members'],
    queryFn: getAllMembers,
    meta: {
      onError: (error: any) => {
        console.error('Error fetching members:', error);
        toast({
          title: 'Error',
          description: 'Failed to load members data. Please try again.',
          variant: 'destructive',
        });
      }
    }
  });

  // Filter members based on search term
  const filteredMembers = searchTerm 
    ? members.filter(member => 
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.includes(searchTerm) ||
        member.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : members;

  // Handle selecting a member (pass to parent component)
  const handleMemberClick = (memberId: string) => {
    onMemberSelect(memberId);
  };

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading members data</p>
        <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="py-10 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
            <p className="mt-3">Loading members...</p>
          </div>
        </div>
      ) : (
        <div>
          {viewMode === 'list' ? (
            <div className="bg-white rounded-md border">
              <MembersTable 
                members={filteredMembers} 
                onMemberClick={handleMemberClick}
                readOnly={readOnly}
              />
            </div>
          ) : (
            <MembersMap members={filteredMembers} />
          )}
          
          <div className="mt-2 text-sm text-gray-500">
            Showing {filteredMembers.length} of {members.length} members
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMembersList;
