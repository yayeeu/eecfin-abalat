
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllMembers, getElderMembers, assignElderToMember, removeElderAssignment } from '@/lib/memberService';
import { Member } from '@/types/database.types';

// Import Sidebar Provider and other necessary components 
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import MemberLoadingState from '@/components/members/MemberLoadingState';
import MemberPageHeader from '@/components/members/MemberPageHeader';
import MemberContentSection from '@/components/members/MemberContentSection';

const ManageMembers = () => {
  const { toast } = useToast();
  const { userRole } = useAuth();
  const queryClient = useQueryClient();
  const [elderGroups, setElderGroups] = useState<{ [key: string]: Member[] }>({});
  const [unassignedMembers, setUnassignedMembers] = useState<Member[]>([]);

  // Get all members
  const { data: members, isLoading: loadingMembers, refetch: refetchMembers, error: membersError } = useQuery({
    queryKey: ['members'],
    queryFn: getAllMembers,
  });

  // Get all elders
  const { data: elders, isLoading: loadingElders, refetch: refetchElders, error: eldersError } = useQuery({
    queryKey: ['elders'],
    queryFn: getElderMembers,
  });

  // Log errors to help debug
  useEffect(() => {
    if (membersError) {
      console.error("Error fetching members:", membersError);
    }
    if (eldersError) {
      console.error("Error fetching elders:", eldersError);
    }
  }, [membersError, eldersError]);

  // Log data when loaded to help debug
  useEffect(() => {
    if (elders) {
      console.log("Elders loaded:", elders);
    }
    if (members) {
      console.log("Members loaded:", members.length, "members found");
    }
  }, [elders, members]);

  // Mutation for assigning a member to an elder
  const assignMutation = useMutation({
    mutationFn: ({ memberId, elderId }: { memberId: string; elderId: string }) => {
      return assignElderToMember(memberId, elderId);
    },
    onSuccess: () => {
      toast({
        title: "Member assigned",
        description: "The member has been successfully assigned to the elder.",
        variant: "default"
      });
      // Invalidate queries to refetch data
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

  // Mutation for removing a member from an elder
  const unassignMutation = useMutation({
    mutationFn: (memberId: string) => {
      return removeElderAssignment(memberId);
    },
    onSuccess: () => {
      toast({
        title: "Member unassigned",
        description: "The member has been successfully removed from the elder.",
        variant: "default"
      });
      // Invalidate queries to refetch data
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

  // Function to handle moving a member to an elder
  const handleMoveMember = (memberId: string, elderId: string | null) => {
    if (elderId) {
      assignMutation.mutate({ memberId, elderId });
    } else {
      unassignMutation.mutate(memberId);
    }
  };

  // Organize members by assigned elder
  useEffect(() => {
    if (!members) return;
    
    console.log("Organizing members:", members.length, "members found");
    
    const groups: { [key: string]: Member[] } = {};
    const unassigned: Member[] = [];

    // Initialize groups for each elder if we have elders
    if (elders && elders.length > 0) {
      elders.forEach(elder => {
        groups[elder.id] = [];
      });
    }

    // Group members by their assigned elder
    members.forEach(member => {
      // Skip elders in member assignment (we don't want to assign elders to other elders)
      if (member.role === 'elder' || member.roles?.name === 'elder') {
        console.log("Skipping elder in member assignments:", member.name);
        return;
      }
      
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
    
    console.log("Elder groups updated:", Object.keys(groups).length, "elders with assigned members");
    console.log("Unassigned members updated:", unassigned.length, "members");
  }, [members, elders]);

  // Make sure we're loading until we have both members and elders
  const isLoading = loadingMembers || loadingElders;

  return (
    <div className="min-h-screen w-full">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Sidebar Component */}
          <AdminSidebar />

          {/* Main content area with header and content */}
          <div className="flex flex-col flex-1">
            {/* Header Component */}
            <AdminHeader />

            {/* Content Component */}
            <div className="flex-1 p-6">
              <MemberPageHeader 
                title="Manage Church Members" 
                description="Assign members to elders using drag and drop functionality."
              />
              
              {isLoading ? (
                <MemberLoadingState message={loadingElders ? "Loading elders data..." : "Loading members data..."} />
              ) : eldersError ? (
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-red-800">Error loading elders</h3>
                  <p className="text-red-700 mt-1">{String(eldersError)}</p>
                </div>
              ) : (
                <MemberContentSection 
                  elders={elders || []}
                  unassignedMembers={unassignedMembers}
                  elderGroups={elderGroups}
                  onMoveMember={handleMoveMember}
                />
              )}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ManageMembers;
