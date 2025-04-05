
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "./ui/button";
import ElderBucket from "./members/ElderBucket";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllMembers, getElderMembers, assignElderToMember, removeElderAssignment } from '@/lib/memberService';
import { Member } from '@/types/database.types';
import { Loader2 } from 'lucide-react';

const MemberManager: React.FC = () => {
  const [elderGroups, setElderGroups] = useState<{ [key: string]: Member[] }>({});
  const [unassignedMembers, setUnassignedMembers] = useState<Member[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch members data
  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ['members'],
    queryFn: getAllMembers
  });

  // Fetch elders data
  const { data: elders, isLoading: loadingElders } = useQuery({
    queryKey: ['elders'],
    queryFn: getElderMembers
  });

  // Mutation for assigning a member to an elder
  const assignMutation = useMutation({
    mutationFn: ({ memberId, elderId }: { memberId: string; elderId: string }) => {
      return assignElderToMember(memberId, elderId);
    },
    onSuccess: () => {
      toast({
        title: "Member assigned",
        description: "The member has been successfully assigned to the elder.",
      });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      toast({
        title: "Assignment failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  });

  // Mutation for removing an elder assignment
  const unassignMutation = useMutation({
    mutationFn: (memberId: string) => {
      return removeElderAssignment(memberId);
    },
    onSuccess: () => {
      toast({
        title: "Member unassigned",
        description: "The member has been unassigned successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      toast({
        title: "Unassignment failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  });

  // Organize members by assigned elder
  useEffect(() => {
    if (!members || !elders) return;

    const groups: { [key: string]: Member[] } = {};
    const unassigned: Member[] = [];

    // Initialize groups for each elder
    elders.forEach(elder => {
      groups[elder.id] = [];
    });

    // Group members by their assigned elder
    members.forEach(member => {
      if (member.assigned_elder && member.assigned_elder.elder_id) {
        const elderId = member.assigned_elder.elder_id;
        if (groups[elderId]) {
          groups[elderId].push(member);
        } else {
          // If the elder doesn't exist in our groups (rare case), put in unassigned
          unassigned.push(member);
        }
      } else {
        unassigned.push(member);
      }
    });

    setElderGroups(groups);
    setUnassignedMembers(unassigned);
  }, [members, elders]);

  const handleMemberDrop = (memberId: string, targetElderId: string | null) => {
    if (targetElderId === null) {
      // Unassign the member
      unassignMutation.mutate(memberId);
    } else {
      // Assign the member to the elder
      assignMutation.mutate({ memberId, elderId: targetElderId });
    }
  };

  if (loadingMembers || loadingElders) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading member and elder data...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Member Assignments</h2>
        <Button asChild variant="default">
          <Link to="/admin/add-member">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Member
          </Link>
        </Button>
      </div>

      <p className="mb-6 text-gray-600">
        Drag and drop members between elders to reassign them. Members can only be assigned to one elder at a time.
      </p>

      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <ElderBucket
              elderId={null}
              elderName="Unassigned Members"
              members={unassignedMembers}
              onMoveMember={handleMemberDrop}
            />
          </div>

          {elders && elders.map((elder) => (
            <div key={elder.id} className="col-span-1">
              <ElderBucket
                elderId={elder.id}
                elderName={elder.name}
                members={elderGroups[elder.id] || []}
                onMoveMember={handleMemberDrop}
              />
            </div>
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

export default MemberManager;
