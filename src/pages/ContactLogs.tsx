import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getContactLogs } from '@/lib/contactLogService';
import { getAllMembers } from '@/lib/memberService';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { ContactLog, Member } from '@/types/database.types';
import SearchBar from '@/components/members/SearchBar';
import ViewToggle from '@/components/members/ViewToggle';
import FilterTabs from '@/components/members/FilterTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, formatDistanceToNow, startOfWeek, subWeeks, isWithinInterval } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  AlertTriangle, 
  MessageSquare, 
  Phone, 
  Mail, 
  UserPlus, 
  HelpCircle, 
  CalendarDays,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactLogForm from '@/components/contact/ContactLogForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const groupContactLogsByTimePeriod = (logs: ContactLog[]) => {
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const lastWeekStart = subWeeks(thisWeekStart, 1);
  const twoWeeksAgoStart = subWeeks(thisWeekStart, 2);
  const fourWeeksAgoStart = subWeeks(thisWeekStart, 4);

  return {
    'This week': logs.filter(log => {
      const logDate = new Date(log.created_at || '');
      return isWithinInterval(logDate, { start: thisWeekStart, end: now });
    }),
    'Last week': logs.filter(log => {
      const logDate = new Date(log.created_at || '');
      return isWithinInterval(logDate, { start: lastWeekStart, end: thisWeekStart });
    }),
    '2 Weeks ago': logs.filter(log => {
      const logDate = new Date(log.created_at || '');
      return isWithinInterval(logDate, { start: twoWeeksAgoStart, end: lastWeekStart });
    }),
    '4 Weeks ago': logs.filter(log => {
      const logDate = new Date(log.created_at || '');
      return isWithinInterval(logDate, { start: fourWeeksAgoStart, end: twoWeeksAgoStart });
    }),
    'Older': logs.filter(log => {
      const logDate = new Date(log.created_at || '');
      return logDate < fourWeeksAgoStart;
    })
  };
};

const groupContactLogsByElder = (logs: ContactLog[]) => {
  const groupedByElder: Record<string, ContactLog[]> = {};
  
  logs.forEach(log => {
    if (log.elder_id && log.elder?.name) {
      if (!groupedByElder[log.elder_id]) {
        groupedByElder[log.elder_id] = [];
      }
      groupedByElder[log.elder_id].push(log);
    }
  });

  return groupedByElder;
};

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
    data: logs = [], 
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
    isError: membersError
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

  const processedData = useMemo(() => {
    let filteredLogs = logs;
    
    if (activeTab === 'flagged') {
      filteredLogs = filteredLogs.filter(log => log.flagged === true);
    } else if (activeTab === 'my-logs') {
      filteredLogs = filteredLogs.filter(log => log.elder_id === 'current-user-id');
    } else if (activeTab === 'no-contact') {
      filteredLogs = logs;
    }
    
    if (searchTerm) {
      filteredLogs = filteredLogs.filter(log => 
        (log.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (log.contact_type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (log.elder?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (log.member?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }

    const byTimePeriod = groupContactLogsByTimePeriod(filteredLogs);
    
    const groupedData: Record<string, Record<string, ContactLog[]>> = {};
    
    Object.entries(byTimePeriod).forEach(([period, periodLogs]) => {
      if (periodLogs.length > 0) {
        groupedData[period] = groupContactLogsByElder(periodLogs);
      }
    });
    
    const membersWithNoLogs: Member[] = [];
    
    if (members.length > 0 && logs.length > 0) {
      const contactedMemberIds = new Set(logs.map(log => log.member_id));
      
      members.forEach(member => {
        if (!contactedMemberIds.has(member.id)) {
          membersWithNoLogs.push(member);
        }
      });
    }
    
    return {
      filteredLogs,
      groupedData,
      membersWithNoLogs,
    };
  }, [logs, members, searchTerm, activeTab]);
  
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

  const handleMemberClick = (memberId: string) => {
    navigate(`/admin/edit-member/${memberId}`);
  };

  const getActiveTabLabel = () => {
    switch (activeTab) {
      case 'flagged': return 'flagged contacts';
      case 'my-logs': return 'of your contact logs';
      case 'no-contact': return 'members without contact history';
      default: return 'all';
    }
  };

  const isLoading = logsLoading || membersLoading;
  const isError = logsError || membersError;

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
              { value: 'my-logs', label: 'My Contact Logs' },
              { value: 'no-contact', label: 'No Contact History' }
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
            ) : activeTab === 'no-contact' ? (
              <div className="space-y-8">
                <div key="no-contact" className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Contacted Long Time Ago
                  </h2>
                  
                  {processedData.membersWithNoLogs.length > 0 ? (
                    <Card className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg">Members Without Contact History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Member</TableHead>
                              <TableHead>Contact Info</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {processedData.membersWithNoLogs.map(member => (
                              <TableRow key={member.id}>
                                <TableCell>
                                  <button 
                                    className="text-blue-600 hover:underline font-medium"
                                    onClick={() => member.id && handleMemberClick(member.id)}
                                  >
                                    {member.name || 'Unknown Member'}
                                  </button>
                                </TableCell>
                                <TableCell>
                                  {member.email && <div className="text-sm">{member.email}</div>}
                                  {member.phone && <div className="text-sm">{member.phone}</div>}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                                    <Clock className="h-3 w-3 mr-1" />
                                    No Contact
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setIsFormOpen(true);
                                      setSelectedLog(null);
                                      setSelectedElder(null);
                                    }}
                                  >
                                    Add Contact
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded">
                      <p className="text-gray-500">All members have been contacted</p>
                    </div>
                  )}
                </div>
              </div>
            ) : processedData.filteredLogs.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(processedData.groupedData).map(([period, elderGroups]) => (
                  Object.keys(elderGroups).length > 0 && (
                    <div key={period} className="mb-8">
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <CalendarDays className="mr-2 h-5 w-5" />
                        {period}
                      </h2>
                      
                      {Object.entries(elderGroups).map(([elderId, elderLogs]) => {
                        const elderName = elderLogs[0]?.elder?.name || 'Unknown Elder';
                        return (
                          <Card key={`${period}-${elderId}`} className="mb-4">
                            <CardHeader>
                              <CardTitle className="text-lg">{elderName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Contact Type</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {elderLogs.map(log => (
                                    <TableRow key={log.id}>
                                      <TableCell>
                                        <button 
                                          className="text-blue-600 hover:underline font-medium"
                                          onClick={() => log.member_id && handleMemberClick(log.member_id)}
                                        >
                                          {log.member?.name || 'Unknown Member'}
                                        </button>
                                      </TableCell>
                                      <TableCell>{log.contact_type}</TableCell>
                                      <TableCell>
                                        {log.created_at && format(new Date(log.created_at), 'MMM d, yyyy')}
                                      </TableCell>
                                      <TableCell>
                                        {log.flagged && (
                                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                            Flagged
                                          </Badge>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )
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
                {activeTab === 'no-contact' 
                  ? `Showing ${processedData.membersWithNoLogs.length} members without contact history`
                  : `Showing ${processedData.filteredLogs.length} ${getActiveTabLabel()} contact logs`
                }
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
            memberId={activeTab === 'no-contact' && selectedElder ? undefined : undefined}
            onSuccess={closeForm}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactLogs;
