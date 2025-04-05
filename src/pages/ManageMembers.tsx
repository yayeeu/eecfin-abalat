import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ElderBucket from '@/components/members/ElderBucket';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllMembers, getElderMembers, assignElderToMember, removeElderAssignment } from '@/lib/memberService';
import { Member } from '@/types/database.types';
import { Loader2 } from 'lucide-react';

// Import Sidebar Provider and other necessary components 
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const ManageMembers = () => {
  const { toast } = useToast();
  const { userRole } = useAuth();
  const queryClient = useQueryClient();
  const [elderGroups, setElderGroups] = useState<{ [key: string]: Member[] }>({});
  const [unassignedMembers, setUnassignedMembers] = useState<Member[]>([]);

  // Get all members
  const { data: members, isLoading: loadingMembers, refetch: refetchMembers } = useQuery({
    queryKey: ['members'],
    queryFn: getAllMembers,
  });

  // Get all elders
  const { data: elders, isLoading: loadingElders, refetch: refetchElders } = useQuery({
    queryKey: ['elders'],
    queryFn: getElderMembers,
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

  const renderContent = () => {
    if (loadingMembers || loadingElders) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading member data...</span>
        </div>
      );
    }

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Members</h1>
        </div>
        
        <p className="text-gray-600 mb-8">
          Drag and drop members between elders to reassign them. Members without assigned elders are listed under "Unassigned".
        </p>

        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Unassigned Members Bucket */}
            <Card className="bg-gray-50 border-dashed">
              <CardHeader>
                <CardTitle>Unassigned Members</CardTitle>
                <CardDescription>Members not assigned to any elder</CardDescription>
              </CardHeader>
              <CardContent>
                <ElderBucket 
                  elderId="unassigned"
                  elderName="Unassigned"
                  members={unassignedMembers}
                  onMoveMember={handleMoveMember}
                />
              </CardContent>
            </Card>

            {/* Elder Buckets */}
            {elders && elders.map(elder => (
              <Card key={elder.id} className="bg-white">
                <CardHeader>
                  <CardTitle>{elder.name}</CardTitle>
                  <CardDescription>
                    {elder.email && `Email: ${elder.email}`}
                    {elder.phone && <><br />Phone: {elder.phone}</>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ElderBucket 
                    elderId={elder.id}
                    elderName={elder.name || "Elder"}
                    members={elderGroups[elder.id] || []}
                    onMoveMember={handleMoveMember}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </DndProvider>
      </div>
    );
  };

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
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-eecfin-navy">
                  Manage Church Members
                </h1>
                <p className="text-gray-500 mt-2">
                  Assign members to elders using drag and drop functionality.
                </p>
              </div>
              {renderContent()}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ManageMembers;
