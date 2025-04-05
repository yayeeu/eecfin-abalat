
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllMembers, getElderMembers } from '@/lib/memberService';
import { getMinistries } from '@/lib/ministryService';
import MemberMetrics from './dashboard/MemberMetrics';
import MinistryStats from './dashboard/MinistryStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['members'],
    queryFn: getAllMembers
  });

  const { data: elders, isLoading: eldersLoading } = useQuery({
    queryKey: ['elders'],
    queryFn: getElderMembers
  });

  const { data: ministries, isLoading: ministriesLoading } = useQuery({
    queryKey: ['ministries'],
    queryFn: () => getMinistries(true)
  });

  const isLoading = membersLoading || eldersLoading || ministriesLoading;

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
            <CardTitle>Ministry Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <MinistryStats 
              ministries={ministries || []} 
              members={members || []} 
              elders={elders || []} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
