
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import FilterTabs from '@/components/members/FilterTabs';
import { ContactLog } from '@/types/database.types';
import { getContactLogs } from '@/lib/contactLogService';
import { getAllElders } from '@/lib/elderService';
import FollowUpGroups from '@/components/follow-ups/FollowUpGroups';

const FollowUps = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeElder, setActiveElder] = useState<string | null>(null);

  // Fetch all contact logs
  const { data: contactLogs, isLoading: isLogsLoading } = useQuery({
    queryKey: ['contact-logs', activeTab, activeElder],
    queryFn: async () => {
      const filters: { elderId?: string; flagged?: boolean } = {};
      
      if (activeElder) {
        filters.elderId = activeElder;
      }
      
      if (activeTab === 'flagged') {
        filters.flagged = true;
      }
      
      // For "my-members" tab, we would filter by the current user's member ID
      // This is a placeholder that would be replaced with actual current user logic
      if (activeTab === 'my-members') {
        // In a real app, you would get the current user's ID
        // filters.elderId = currentUserId;
        console.log('My members filter would be applied here');
      }
      
      return getContactLogs(filters);
    }
  });

  // Fetch all elders for the elder filter
  const { data: elders, isLoading: isEldersLoading } = useQuery({
    queryKey: ['elders'],
    queryFn: getAllElders
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleElderChange = (elderId: string | null) => {
    setActiveElder(elderId);
  };

  if (isLogsLoading || isEldersLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading follow-ups...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Follow Ups</h1>
      
      {/* Elders Filter Tabs */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Filter by Elder</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleElderChange(null)}
            className={`px-4 py-2 text-sm rounded-full ${
              activeElder === null
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All Elders
          </button>
          
          {elders?.map((elder) => (
            <button
              key={elder.id}
              onClick={() => handleElderChange(elder.id)}
              className={`px-4 py-2 text-sm rounded-full ${
                activeElder === elder.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {elder.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Filter Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <FilterTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        <TabsContent value="all">
          <FollowUpGroups contactLogs={contactLogs || []} />
        </TabsContent>
        
        <TabsContent value="flagged">
          <FollowUpGroups contactLogs={contactLogs || []} />
        </TabsContent>
        
        <TabsContent value="my-members">
          <FollowUpGroups contactLogs={contactLogs || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowUps;
