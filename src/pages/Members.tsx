
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllMembers } from '@/lib/memberService';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AllMembersList from '@/components/AllMembersList';
import MemberPageHeader from '@/components/members/MemberPageHeader';
import AddMemberDialog from '@/components/members/AddMemberDialog';

const Members: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');

  // Query to fetch all members
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle refreshing data
  const handleRefresh = () => {
    refetch();
    toast({
      title: 'Refreshed',
      description: 'Member data has been refreshed',
    });
  };

  // Handle member selection
  const handleMemberSelect = (memberId: string) => {
    // For now, just log the ID - we'll implement editing in the future
    console.log(`Selected member: ${memberId}`);
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <MemberPageHeader
          title="Church Members"
          description="View and manage all church members"
        />
        
        <div className="flex gap-2 mt-4 sm:mt-0">
          <AddMemberDialog 
            onMemberAdded={handleRefresh}
          />
          <Button 
            variant="outline" 
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </div>
      </div>

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

        <AllMembersList 
          onMemberSelect={handleMemberSelect} 
          searchTerm={searchTerm}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};

export default Members;
