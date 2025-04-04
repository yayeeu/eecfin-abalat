
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ElderBucket from '@/components/members/ElderBucket';
import CustomLayout from '@/components/CustomLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllMembers, getElderMembers, assignElderToMember, removeElderAssignment } from '@/lib/memberService';
import { populateWithSampleData } from '@/lib/services/elderService';
import { Member } from '@/types/database.types';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ManageMembers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [elderGroups, setElderGroups] = useState<{ [key: string]: Member[] }>({});
  const [unassignedMembers, setUnassignedMembers] = useState<Member[]>([]);
  const [isPopulating, setIsPopulating] = useState(false);

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

  // Function to populate the database with sample data
  const handlePopulateData = async () => {
    setIsPopulating(true);
    try {
      const result = await populateWithSampleData();
      if (result.success) {
        toast({
          title: "Data populated",
          description: result.message,
          variant: "default"
        });
        // Refetch data to update the UI
        refetchMembers();
        refetchElders();
      } else {
        toast({
          title: "Population failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Population failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsPopulating(false);
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

  if (loadingMembers || loadingElders) {
    return (
      <CustomLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading member data...</span>
        </div>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Members</h1>
          <Button 
            onClick={handlePopulateData} 
            disabled={isPopulating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPopulating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Populating...
              </>
            ) : (
              'Populate with Sample Data'
            )}
          </Button>
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
                  elderId={null}
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
    </CustomLayout>
  );
};

export default ManageMembers;
