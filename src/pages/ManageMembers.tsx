
import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getElderMembers, getAllMembers, assignElderToMember, removeElderAssignment } from '@/lib/memberService';
import { Member } from '@/types/database.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import EldershipCard from '@/components/members/EldershipCard';
import UnassignedMembersCard from '@/components/members/UnassignedMembersCard';

const ManageMembers: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [elderMembers, setElderMembers] = useState<Member[]>([]);
  const [unassignedMembers, setUnassignedMembers] = useState<Member[]>([]);
  const [membersByElder, setMembersByElder] = useState<Record<string, Member[]>>({});

  // Get all elders
  const { data: elders, isLoading: isLoadingElders } = useQuery({
    queryKey: ['elders'],
    queryFn: getElderMembers
  });

  // Get all members
  const { data: allMembers, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['members'],
    queryFn: getAllMembers
  });

  // Mutation for assigning a member to an elder
  const assignMutation = useMutation({
    mutationFn: ({ memberId, elderId }: { memberId: string, elderId: string | null }) => {
      if (elderId) {
        return assignElderToMember(memberId, elderId);
      } else {
        return removeElderAssignment(memberId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({
        title: "Member assigned",
        description: "Member has been successfully reassigned.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to assign member: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Organize members into elder groups and unassigned
  useEffect(() => {
    if (!allMembers || !elders) return;

    // Create a map of elder IDs to their members
    const elderMembersMap: Record<string, Member[]> = {};
    const unassigned: Member[] = [];

    // Initialize the map with empty arrays for each elder
    elders.forEach(elder => {
      elderMembersMap[elder.id] = [];
    });

    // Assign members to elders based on assigned_elder
    allMembers.forEach(member => {
      if (
        member.assigned_elder && 
        member.assigned_elder.elder_id && 
        elderMembersMap[member.assigned_elder.elder_id]
      ) {
        elderMembersMap[member.assigned_elder.elder_id].push(member);
      } else if (member.role !== 'elder' && member.role !== 'admin') {
        // Only add non-elder and non-admin members to unassigned
        unassigned.push(member);
      }
    });

    setMembersByElder(elderMembersMap);
    setUnassignedMembers(unassigned);
    setElderMembers(elders);
  }, [allMembers, elders]);

  const handleDrop = (memberId: string, elderId: string | null) => {
    assignMutation.mutate({ memberId, elderId });
  };

  const handleAddMember = () => {
    navigate('/admin/add-member');
  };

  if (isLoadingElders || isLoadingMembers) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading members data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Member Assignments</h1>
        <Button onClick={handleAddMember} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <p className="text-gray-600 mb-6">
        Drag and drop members between elders to assign them. 
        Members can be assigned to one elder at a time.
      </p>

      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Unassigned Members Card */}
          <UnassignedMembersCard 
            members={unassignedMembers}
            onDrop={handleDrop}
            isLoading={assignMutation.isPending}
          />

          {/* Elder Cards */}
          {elderMembers.map(elder => (
            <EldershipCard
              key={elder.id}
              elder={elder}
              members={membersByElder[elder.id] || []}
              onDrop={handleDrop}
              isLoading={assignMutation.isPending}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

export default ManageMembers;
