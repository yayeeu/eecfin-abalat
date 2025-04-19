
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllMembers, getElderMembers } from '@/lib/memberService';
import { getContactLogsByElderId } from '@/lib/contactLogService';
import { getCurrentUser } from '@/services/authService';
import MemberMetrics from './dashboard/MemberMetrics';
import ElderCareMetrics from './dashboard/ElderCareMetrics';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Member } from '@/types/database.types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getMembersByElderId } from '@/lib/memberService';

const Dashboard: React.FC = () => {
  const { data: currentUser, isLoading: userLoading } = useQuery<Member | null>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['members'],
    queryFn: getAllMembers,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !userLoading, // Only run when user is loaded
  });

  const { data: elders, isLoading: eldersLoading } = useQuery({
    queryKey: ['elders'],
    queryFn: getElderMembers,
    staleTime: 30 * 60 * 1000, // 30 minutes - elders don't change often
    enabled: !userLoading, // Only run when user is loaded
  });

  const isElder = currentUser?.roles?.name === 'elder';
  
  const { data: myMembers, isLoading: myMembersLoading } = useQuery({
    queryKey: ['myMembers', currentUser?.id],
    queryFn: () => getMembersByElderId(currentUser!.id),
    staleTime: 10 * 60 * 1000,
    enabled: !!currentUser?.id && isElder,
  });

  const { data: contactLogs, isLoading: contactLogsLoading } = useQuery({
    queryKey: ['contactLogs', currentUser?.id],
    queryFn: () => getContactLogsByElderId(currentUser!.id),
    staleTime: 5 * 60 * 1000,
    enabled: !!currentUser?.id && isElder,
  });

  const getMembersByElderId = async (elderId: string) => {
    try {
      const result = await import('@/lib/memberService').then(module => 
        module.getMembersByElderId(elderId)
      );
      return result;
    } catch (error) {
      console.error('Error fetching members assigned to elder:', error);
      return [];
    }
  };

  const isLoading = userLoading || 
    membersLoading || 
    eldersLoading || 
    (isElder && (myMembersLoading || contactLogsLoading));

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
      <Accordion type="single" collapsible defaultValue="general-stats" className="space-y-4">
        <AccordionItem value="general-stats" className="border rounded-lg">
          <AccordionTrigger className="px-4">
            <h3 className="text-xl font-semibold">General Stats</h3>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <MemberMetrics 
                  members={members || []} 
                  myMembers={myMembers} 
                />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="recent-activities" className="border rounded-lg">
          <AccordionTrigger className="px-4">
            <h3 className="text-xl font-semibold">Recent Activities</h3>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4">All Activities</h4>
                <ElderCareMetrics 
                  members={members || []} 
                  contactLogs={contactLogs || []} 
                  elderId={currentUser?.id}
                  displayAllActivities={true}
                />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Dashboard;

