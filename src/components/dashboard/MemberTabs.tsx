
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllMembers, getMembersByElderId } from '@/lib/memberService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Users } from 'lucide-react';
import MemberCard from '@/components/members/MemberCard';
import { Badge } from '@/components/ui/badge';

interface MemberTabsProps {
  onMemberSelect: (memberId: string) => void;
}

const MemberTabs: React.FC<MemberTabsProps> = ({ onMemberSelect }) => {
  const { user } = useAuth();

  const { data: allMembers, isLoading: allLoading } = useQuery({
    queryKey: ['all-members-dashboard'],
    queryFn: getAllMembers
  });

  const { data: myMembers, isLoading: myLoading } = useQuery({
    queryKey: ['my-members-dashboard', user?.id],
    queryFn: () => user?.id ? getMembersByElderId(user.id) : Promise.resolve([]),
    enabled: !!user?.id
  });

  const renderMemberList = (members = [], loading = false, emptyMessage = 'No members found') => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (members.length === 0) {
      return (
        <div className="text-center py-10">
          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.slice(0, 6).map((member) => (
          <MemberCard 
            key={member.id} 
            member={member} 
            onClick={() => onMemberSelect(member.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">
          All Members 
          {allMembers && <Badge variant="outline" className="ml-2">{allMembers.length}</Badge>}
        </TabsTrigger>
        <TabsTrigger value="mine">
          Under My Care
          {myMembers && <Badge variant="outline" className="ml-2">{myMembers.length}</Badge>}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-4">
        {renderMemberList(allMembers, allLoading)}
      </TabsContent>
      
      <TabsContent value="mine" className="space-y-4">
        {renderMemberList(myMembers, myLoading, 'No members assigned to you')}
      </TabsContent>
    </Tabs>
  );
};

export default MemberTabs;
