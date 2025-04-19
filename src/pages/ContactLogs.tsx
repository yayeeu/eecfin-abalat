import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getContactLogs } from '@/lib/contactLogService';
import { getAllMembers } from '@/lib/memberService';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ContactLog } from '@/types/database.types';
import FilterTabs from '@/components/members/FilterTabs';
import { Loader2 } from 'lucide-react';
import GroupedContactLogs from '@/components/contact/GroupedContactLogs';
import ContactLogsHeader from '@/components/contact/ContactLogsHeader';
import ContactLogsControls from '@/components/contact/ContactLogsControls';
import ContactLogDialog from '@/components/contact/ContactLogDialog';
import MyContactLogs from '@/components/contact/MyContactLogs';

const ContactLogs: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ContactLog | null>(null);
  const [selectedElder, setSelectedElder] = useState<string | null>(null);

  const { 
    data: elderData = [], 
    isLoading: logsLoading, 
    isError: logsError,
    refetch 
  } = useQuery({
    queryKey: ['contact-logs'],
    queryFn: () => getContactLogs(),
    meta: {
      onError: (error: any) => {
        console.error('Error fetching contact logs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load contact logs data. Please try again.',
          variant: 'destructive',
        });
      }
    }
  });

  const {
    data: members = [],
    isLoading: membersLoading,
  } = useQuery({
    queryKey: ['all-members'],
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddNew = () => {
    setSelectedLog(null);
    setIsFormOpen(true);
  };

  const handleMemberClick = (memberId: string) => {
    navigate(`/admin/edit-member/${memberId}`);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedLog(null);
    refetch();
  };

  const getActiveTabLabel = () => {
    switch (activeTab) {
      case 'my-logs': return 'of your contact logs';
      default: return 'all';
    }
  };

  if (logsLoading || membersLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-eecfin-navy" />
        <span className="ml-2">Loading contact logs...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <ContactLogsHeader onAddNew={handleAddNew} />
      
      <ContactLogsControls
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <FilterTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          customTabs={[
            { value: 'all', label: 'All Logs' },
            { value: 'my-logs', label: 'My Contact Logs' }
          ]}
        />

        <TabsContent value={activeTab} className="mt-0">
          {activeTab === 'all' ? (
            <GroupedContactLogs 
              elders={elderData}
              onMemberClick={handleMemberClick}
            />
          ) : (
            <MyContactLogs onMemberClick={handleMemberClick} />
          )}
            
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {activeTab === 'all' ? elderData.length : 0} {getActiveTabLabel()} contact logs
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <ContactLogDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        selectedLog={selectedLog}
        elderId={selectedElder || undefined}
        onSuccess={closeForm}
      />
    </div>
  );
};

export default ContactLogs;
