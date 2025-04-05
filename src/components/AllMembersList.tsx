
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllMembers, getMember } from '@/lib/memberService';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, MapPin, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MembersTable from '@/components/members/MembersTable';
import MembersMap from '@/components/dashboard/MembersMap';
import MemberDetailView from '@/components/members/MemberDetailView';
import { useNavigate } from 'react-router-dom';
import { Member } from '@/types/database.types';
import AddMemberDialog from '@/components/members/AddMemberDialog';

interface AllMembersListProps {
  onMemberSelect: (memberId: string) => void;
  readOnly?: boolean;
}

const AllMembersList = ({ onMemberSelect, readOnly = false }: AllMembersListProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);

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

  console.log('Members data in AllMembersList:', members);

  // Filter members based on search term
  const filteredMembers = searchTerm 
    ? members.filter(member => 
        (member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.phone || '').includes(searchTerm) ||
        (member.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    : members;

  console.log('Filtered members:', filteredMembers);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle selecting a member (pass to parent component)
  const handleMemberClick = (memberId: string) => {
    onMemberSelect(memberId);
  };

  // Handle viewing member details
  const handleViewDetails = async (member: Member) => {
    setSelectedMember(member);
    setShowDetailView(true);
  };

  // Handle editing a member
  const handleEditMember = (memberId: string) => {
    navigate(`/admin/edit-member/${memberId}`);
  };

  // Handle closing the detail view
  const handleCloseDetailView = () => {
    setShowDetailView(false);
    setSelectedMember(null);
  };

  // Handle member added
  const handleMemberAdded = () => {
    refetch();
    toast({
      title: "Success",
      description: "Member added successfully",
    });
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
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search members..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex gap-2">
          <AddMemberDialog onMemberAdded={handleMemberAdded} />

          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v)}
            className="w-auto"
          >
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="list" className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                List
              </TabsTrigger>
              
              <TabsTrigger value="map" className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Map
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

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
                onViewDetails={handleViewDetails}
                onEditMember={handleEditMember}
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

      {showDetailView && selectedMember && (
        <MemberDetailView 
          member={selectedMember} 
          onClose={handleCloseDetailView} 
        />
      )}
    </div>
  );
};

export default AllMembersList;
