
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Member } from '@/types/database.types';
import { getMember } from '@/lib/memberService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import ContactLogList from '@/components/contact/ContactLogList';
import ElderAssignmentSelect from './ElderAssignmentSelect';

interface MemberContactLogsProps {
  memberId: string;
  onLogAdded?: () => void;
}

const MemberContactLogs: React.FC<MemberContactLogsProps> = ({ memberId, onLogAdded }) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: member, isLoading, isError, refetch } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => getMember(memberId),
    enabled: !!memberId
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: 'Refreshed',
        description: 'Contact logs have been refreshed',
      });
      if (onLogAdded) {
        onLogAdded();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh contact logs',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading member details...</span>
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error loading member details. Please try again later.</p>
        <Button onClick={() => refetch()} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Member Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Name</h3>
            <p>{member.name}</p>
          </div>
          <div>
            <h3 className="font-medium">Role</h3>
            <p>{member.role || 'No role specified'}</p>
          </div>
          <div>
            <h3 className="font-medium">Contact</h3>
            <p>{member.phone || 'No phone'} / {member.email || 'No email'}</p>
          </div>
          <div>
            <h3 className="font-medium">Assigned Elder</h3>
            <ElderAssignmentSelect 
              member={member} 
              onAssignmentChanged={() => refetch()}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Contact History</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Refresh
          </Button>
        </div>
        
        {member.assigned_elder ? (
          <ContactLogList 
            elderId={member.assigned_elder.elder_id} 
            memberId={member.id}
            showContactButtons={true}
          />
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded">
            <p className="text-gray-500">No elder assigned to this member.</p>
            <p className="text-gray-500 mt-2">Assign an elder to track contact history.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberContactLogs;
