
import React, { useEffect } from "react";
import { useToast } from "./ui/use-toast";
import AddMemberDialog from "./members/AddMemberDialog";
import ElderBucketsGrid from "./members/ElderBucketsGrid";
import { useElderAssignments } from "@/hooks/useElderAssignments";
import { updateMemberAssignment, findCurrentElderId } from "@/services/elderAssignmentService";

const MemberManager: React.FC = () => {
  const { 
    elders, 
    members, 
    elderAssignments, 
    loading, 
    fetchData, 
    setElderAssignments 
  } = useElderAssignments();
  
  const { toast } = useToast();

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
