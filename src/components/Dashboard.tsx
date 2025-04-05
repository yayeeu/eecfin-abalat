
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllMembers, getElderMembers, getMembersByElderId } from '@/lib/memberService';
import { getContactLogsByElderId } from '@/lib/contactLogService';
import { getCurrentUser } from '@/services/authService';
import MemberMetrics from './dashboard/MemberMetrics';
import ElderCareMetrics from './dashboard/ElderCareMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Member } from '@/types/database.types';

const Dashboard: React.FC = () => {
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['members'],
    queryFn: getAllMembers
  });

  const { data: elders, isLoading: eldersLoading } = useQuery({
    queryKey: ['elders'],
    queryFn: getElderMembers
  });

  const { data: currentUser, isLoading: userLoading } = useQuery<Member | null>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser
  });

  const { data: myMembers, isLoading: myMembersLoading } = useQuery({
    queryKey: ['myMembers', currentUser?.id],
    queryFn: () => currentUser?.id ? getMembersByElderId(currentUser.id) : Promise.resolve([]),
    enabled: !!currentUser?.id
  });

  const { data: contactLogs, isLoading: contactLogsLoading } = useQuery({
    queryKey: ['contactLogs', currentUser?.id],
    queryFn: () => currentUser?.id ? getContactLogsByElderId(currentUser.id) : Promise.resolve([]),
    enabled: !!currentUser?.id
  });

  const isLoading = membersLoading || eldersLoading || myMembersLoading || contactLogsLoading || userLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-eecfin-navy" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Membership Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <MemberMetrics members={members || []} />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Under my Care</CardTitle>
          </CardHeader>
          <CardContent>
            <ElderCareMetrics 
              members={myMembers || []} 
              contactLogs={contactLogs || []} 
              elderId={currentUser?.id} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
