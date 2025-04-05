
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, AlertTriangle, Check } from 'lucide-react';
import { getMembersWithContactStatus } from '@/lib/followupService';
import SearchBar from '@/components/members/SearchBar';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FollowUpsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');

  const { data: membersWithStatus, isLoading, isError, refetch } = useQuery({
    queryKey: ['members-with-contact-status', activeTab],
    queryFn: () => getMembersWithContactStatus(activeTab !== 'all' ? activeTab : undefined),
    meta: {
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: 'Failed to load follow-up data',
          variant: 'destructive',
        });
      }
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleMemberClick = (memberId: string) => {
    navigate(`/admin/member/${memberId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-8 w-8 mx-auto text-red-500" />
        <p className="mt-2">Failed to load follow-up data</p>
        <Button onClick={() => refetch()} className="mt-4">Retry</Button>
      </div>
    );
  }

  const getFilteredMembers = () => {
    if (!membersWithStatus) return [];
    
    return membersWithStatus.filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredMembers = getFilteredMembers();

  const formatLastContact = (date: string | null) => {
    if (!date) return "Never contacted";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'recent': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'recent': return <Check className="h-3 w-3 mr-1" />;
      case 'overdue': return <AlertTriangle className="h-3 w-3 mr-1" />;
      case 'pending': return <Calendar className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between mb-4">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">Recently Contacted</TabsTrigger>
          <TabsTrigger value="pending">Pending Follow-up</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map(member => (
                <Card 
                  key={member.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleMemberClick(member.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(member.status)}
                      >
                        {getStatusIcon(member.status)}
                        {member.status === 'recent' ? 'Recent' : 
                         member.status === 'overdue' ? 'Overdue' : 
                         member.status === 'pending' ? 'Pending' : 'No Contact'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>Last contacted: {formatLastContact(member.lastContactDate)}</p>
                      {member.lastContactType && (
                        <p>Method: {member.lastContactType}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                {searchTerm ? "No members match your search" : "No members found for this category"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowUpsList;
