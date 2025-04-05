import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllMembers } from '@/lib/memberService';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Member } from '@/types/database.types';
import AddMemberDialog from '@/components/members/AddMemberDialog';
import MemberDetailView from '@/components/members/MemberDetailView';
import SearchBar from '@/components/members/SearchBar';
import ViewToggle from '@/components/members/ViewToggle';
import FilterTabs from '@/components/members/FilterTabs';
import MembersListContent from '@/components/members/MembersListContent';

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
  const [activeTab, setActiveTab] = useState('all');

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

  const getFilteredMembers = () => {
    let filtered = members;
    
    if (activeTab === 'flagged') {
      filtered = filtered.filter(member => member.flagged === true);
    } else if (activeTab === 'my-members') {
      filtered = filtered.filter(member => member.assigned_to_current_user === true);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(member => 
        (member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.phone || '').includes(searchTerm) ||
        (member.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredMembers = getFilteredMembers();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleMemberClick = (memberId: string) => {
    onMemberSelect(memberId);
  };

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    setShowDetailView(true);
  };

  const handleEditMember = (memberId: string) => {
    navigate(`/admin/edit-member/${memberId}`);
  };

  const handleCloseDetailView = () => {
    setShowDetailView(false);
    setSelectedMember(null);
  };

  const handleMemberAdded = () => {
    refetch();
    toast({
      title: "Success",
      description: "Member added successfully",
    });
  };

  const getActiveTabLabel = () => {
    switch (activeTab) {
      case 'flagged': return 'flagged members';
      case 'my-members': return 'of your assigned members';
      default: return 'all';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between mb-4">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />

        <div className="flex gap-2">
          <AddMemberDialog onMemberAdded={handleMemberAdded} />
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <TabsContent value="all" className="mt-0">
          <MembersListContent
            isLoading={isLoading}
            filteredMembers={filteredMembers}
            viewMode={viewMode}
            onMemberClick={handleMemberClick}
            onViewDetails={handleViewDetails}
            onEditMember={handleEditMember}
            readOnly={readOnly}
            refetch={refetch}
            isError={isError}
            totalCount={members.length}
            activeTabLabel={getActiveTabLabel()}
          />
        </TabsContent>

        <TabsContent value="flagged" className="mt-0">
          <MembersListContent
            isLoading={isLoading}
            filteredMembers={filteredMembers}
            viewMode={viewMode}
            onMemberClick={handleMemberClick}
            onViewDetails={handleViewDetails}
            onEditMember={handleEditMember}
            readOnly={readOnly}
            refetch={refetch}
            isError={isError}
            totalCount={members.length}
            activeTabLabel={getActiveTabLabel()}
          />
        </TabsContent>

        <TabsContent value="my-members" className="mt-0">
          <MembersListContent
            isLoading={isLoading}
            filteredMembers={filteredMembers}
            viewMode={viewMode}
            onMemberClick={handleMemberClick}
            onViewDetails={handleViewDetails}
            onEditMember={handleEditMember}
            readOnly={readOnly}
            refetch={refetch}
            isError={isError}
            totalCount={members.length}
            activeTabLabel={getActiveTabLabel()}
          />
        </TabsContent>
      </Tabs>

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
