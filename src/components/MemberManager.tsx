
import React, { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import AddMemberDialog from "./members/AddMemberDialog";
import ElderBucketsGrid from "./members/ElderBucketsGrid";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/types/database.types";
import { updateMemberAssignment, findCurrentElderId } from "@/services/elderAssignmentService";

// Simple types for elders
interface SimpleElder {
  id: string;
  name: string;
}

// Define the assignments map type
type ElderAssignmentsMap = Record<string, string[]>;

const MemberManager: React.FC = () => {
  const [elders, setElders] = useState<SimpleElder[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [elderAssignments, setElderAssignments] = useState<ElderAssignmentsMap>({
    unassigned: [],
  });
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // First get the role ID for elder
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", "elder")
        .single();

      if (roleError) {
        console.error("Error fetching elder role:", roleError);
        throw roleError;
      }

      console.log("Elder role ID:", roleData.id);

      // Get all active elders
      const eldersResult = await supabase
        .from("members")
        .select("id, name")
        .eq("role_id", roleData.id)
        .eq("status", "active");

      if (eldersResult.error) {
        console.error("Error fetching elders:", eldersResult.error);
        throw eldersResult.error;
      }

      console.log("Fetched elders:", eldersResult.data);

      // Fetch all members (don't filter by role_id here to get all members)
      const membersResult = await supabase
        .from("members")
        .select("*")
        .eq("status", "active");

      if (membersResult.error) {
        console.error("Error fetching members:", membersResult.error);
        throw membersResult.error;
      }

      console.log("Fetched members:", membersResult.data?.length || 0, "members");

      // Ensure the data matches our type definition
      const typedMembers = membersResult.data?.map(member => member as Member) || [];
      setMembers(typedMembers);
      
      // Fetch current elder assignments
      const assignmentsResult = await supabase
        .from("member_under_elder")
        .select("elder_id, member_id");

      if (assignmentsResult.error) {
        console.error("Error fetching assignments:", assignmentsResult.error);
        throw assignmentsResult.error;
      }

      // Process the data
      const eldersData = eldersResult.data || [];
      setElders(eldersData);

      // Create initial assignments map
      const assignments: ElderAssignmentsMap = { unassigned: [] };
      
      // Initialize assignments for each elder - ensure all elders appear even with no assignments
      eldersData.forEach((elder) => {
        assignments[elder.id] = [];
      });

      // Add members to their assigned elders
      assignmentsResult.data?.forEach((assignment) => {
        if (assignments[assignment.elder_id]) {
          assignments[assignment.elder_id].push(assignment.member_id);
        }
      });

      // Find unassigned members - exclude elders from being assignable
      const elderIds = eldersData.map(elder => elder.id);
      const assignedMemberIds = assignmentsResult.data?.map(a => a.member_id) || [];
      
      // Regular members are those who are not elders
      const regularMembers = typedMembers.filter(
        member => !elderIds.includes(member.id)
      ) || [];
      
      // Unassigned regular members
      const unassignedMembers = regularMembers.filter(
        member => !assignedMemberIds.includes(member.id)
      );
      
      assignments.unassigned = unassignedMembers.map(m => m.id);

      setElderAssignments(assignments);
      console.log("Elder assignments:", assignments);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load elders and members data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("MemberManager received elders:", elders);
  }, [elders]);

  const handleMemberDrop = async (memberId: string, targetElderId: string) => {
    try {
      // Find which elder bucket the member is currently in
      const currentElderId = findCurrentElderId(memberId, elderAssignments);
      
      if (currentElderId === targetElderId) return; // No change needed

      // Update the local state first for immediate feedback
      const newAssignments = { ...elderAssignments };
      
      // Remove from current bucket
      if (currentElderId) {
        newAssignments[currentElderId] = newAssignments[currentElderId].filter(
          id => id !== memberId
        );
      }
      
      // Add to target bucket
      if (!newAssignments[targetElderId]) {
        newAssignments[targetElderId] = [];
      }
      
      if (!newAssignments[targetElderId].includes(memberId)) {
        newAssignments[targetElderId].push(memberId);
      }
      
      setElderAssignments(newAssignments);

      // Update in the database
      await updateMemberAssignment(memberId, targetElderId, currentElderId);

      toast({
        title: "Success",
        description: "Member assignment updated successfully",
      });
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast({
        title: "Error",
        description: "Failed to update member assignment",
        variant: "destructive",
      });
      
      // Refresh the data to ensure state is consistent with database
      fetchData();
    }
  };

  const handleMemberAdded = () => {
    // Refresh the data after a new member is added
    fetchData();
  };

  if (loading) {
    return <div className="p-8">Loading elder and member data...</div>;
  }

  if (elders.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Member Assignments</h2>
          <AddMemberDialog onMemberAdded={handleMemberAdded} />
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <p className="text-yellow-800">
            No elders found in the system. Please add members with the elder role to start assigning regular members to elders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Member Assignments</h2>
        <AddMemberDialog onMemberAdded={handleMemberAdded} />
      </div>

      <p className="mb-6 text-gray-600">
        Drag and drop members between elders to reassign them. Members can only be assigned to one elder at a time.
      </p>

      <ElderBucketsGrid
        elders={elders}
        members={members}
        elderAssignments={elderAssignments}
        onMemberDrop={handleMemberDrop}
      />
    </div>
  );
};

export default MemberManager;
