
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContactLog } from '@/types/database.types';
import GroupedContactLogs from '@/components/contact/GroupedContactLogs';
import MyContactLogs from '@/components/contact/MyContactLogs';
import ContactLogDialog from '@/components/contact/ContactLogDialog';
import FilterTabs from '@/components/members/FilterTabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const ContactLogs: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ContactLog | null>(null);
  const [selectedElder, setSelectedElder] = useState<string | null>(null);

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
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contact Logs</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Contact Log
        </Button>
      </div>

      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <FilterTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            customTabs={[
              { value: 'all', label: 'All Logs' },
              { value: 'my-logs', label: 'My Contact Logs' }
            ]}
          />

          <TabsContent value={activeTab}>
            {activeTab === 'all' ? (
              <GroupedContactLogs 
                elders={[]}
                onMemberClick={handleMemberClick}
              />
            ) : (
              <MyContactLogs onMemberClick={handleMemberClick} />
            )}
          </TabsContent>
        </Tabs>
      </div>

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
