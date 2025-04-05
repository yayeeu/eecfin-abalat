
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getContactLogs } from '@/lib/contactLogService';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { ContactLog, Member } from '@/types/database.types';
import SearchBar from '@/components/members/SearchBar';
import ViewToggle from '@/components/members/ViewToggle';
import FilterTabs from '@/components/members/FilterTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, MessageSquare, Phone, Mail, UserPlus, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactLogForm from '@/components/contact/ContactLogForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ContactLogs: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ContactLog | null>(null);

  // Query to fetch all contact logs
  const { 
    data: logs = [], 
    isLoading, 
    isError,
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

  // Filter logs based on active tab and search term
  const getFilteredLogs = () => {
    let filtered = logs;
    
    // First filter by tab selection
    if (activeTab === 'flagged') {
      filtered = filtered.filter(log => log.flagged === true);
    } else if (activeTab === 'my-logs') {
      // In a real implementation, this would filter by the current user's logs
      filtered = filtered.filter(log => log.elder_id === 'current-user-id');
    }
    
    // Then apply search filter if there's a search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        (log.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (log.contact_type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (log.elder?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (log.member?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredLogs = getFilteredLogs();

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddNew = () => {
    setSelectedLog(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedLog(null);
    refetch();
  };

  const getContactTypeIcon = (type: ContactLog['contact_type']) => {
    switch (type) {
      case 'Text Message':
        return <MessageSquare className="h-4 w-4" />;
      case 'Phone Call':
        return <Phone className="h-4 w-4" />;
      case 'In Person':
        return <UserPlus className="h-4 w-4" />;
      case 'Email':
        return <Mail className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  // Get appropriate label for count display
  const getActiveTabLabel = () => {
    switch (activeTab) {
      case 'flagged': return 'flagged contacts';
      case 'my-logs': return 'of your contact logs';
      default: return 'all';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-eecfin-navy" />
        <span className="ml-2">Loading contact logs...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Logs</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Contact Log
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between mb-4">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange} 
          />

          <div className="flex gap-2">
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <FilterTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            customTabs={[
              { value: 'all', label: 'All Logs' },
              { value: 'flagged', label: 'Flagged' },
              { value: 'my-logs', label: 'My Contact Logs' }
            ]}
          />

          <TabsContent value={activeTab} className="mt-0">
            {isError ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error loading contact logs</p>
                <Button onClick={() => refetch()} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : filteredLogs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredLogs.map((log) => (
                  <Card key={log.id} className={log.flagged ? 'border-yellow-500' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base flex items-center space-x-2">
                            {getContactTypeIcon(log.contact_type)}
                            <span>{log.contact_type}</span>
                            {log.flagged && (
                              <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="text-sm text-muted-foreground">
                            {log.elder?.name && log.member?.name ? (
                              <>Elder {log.elder.name} contacted {log.member.name}</>
                            ) : (
                              <>Contact record</>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {log.notes ? (
                        <p className="text-sm whitespace-pre-line">{log.notes}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No notes provided</p>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground">
                        {log.created_at && (
                          <span>
                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded">
                <p className="text-gray-500">No contact logs found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleAddNew}
                >
                  Add First Contact Log
                </Button>
              </div>
            )}
            
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredLogs.length} {getActiveTabLabel()} contact logs
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedLog ? 'Edit Contact Log' : 'Add New Contact Log'}
            </DialogTitle>
          </DialogHeader>
          
          <ContactLogForm
            initialData={selectedLog || undefined}
            onSuccess={closeForm}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactLogs;
