
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "./ui/button";
import ElderBucket from "./members/ElderBucket";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AddMemberDialog from "./members/AddMemberDialog";

interface Member {
  id: string;
  name?: string;
  email?: string;
}

interface Elder {
  id: string;
  name: string;
}

const MemberManager: React.FC = () => {
  const [elders, setElders] = useState<Elder[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [elderAssignments, setElderAssignments] = useState<Record<string, string[]>>({
    unassigned: [],
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [toast]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all members with elder role
      const { data: eldersData, error: eldersError } = await supabase
        .from("members")
        .select("id, name")
        .eq("role", "elder");

      if (eldersError) throw eldersError;

      // Fetch all regular members (non-elders)
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("id, name, email")
        .neq("role", "elder"); // Exclude elders from general members list

      if (membersError) throw membersError;

      // Fetch current elder assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from("member_under_elder")
        .select("elder_id, member_id");

      if (assignmentsError) throw assignmentsError;

      // Process the data
      setElders(eldersData || []);
      setMembers(membersData || []);

      // Create initial assignments map
      const assignments: Record<string, string[]> = { unassigned: [] };
      
      // Initialize assignments for each elder
      eldersData?.forEach((elder) => {
        assignments[elder.id] = [];
      });

      // Add members to their assigned elders
      assignmentsData?.forEach((assignment) => {
        if (assignments[assignment.elder_id]) {
          assignments[assignment.elder_id].push(assignment.member_id);
        }
      });

      // Find unassigned members
      const assignedMemberIds = assignmentsData?.map(a => a.member_id) || [];
      const unassignedMembers = membersData?.filter(
        member => !assignedMemberIds.includes(member.id)
      ) || [];
      
      assignments.unassigned = unassignedMembers.map(m => m.id);

      setElderAssignments(assignments);
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

  const handleMemberDrop = async (memberId: string, targetElderId: string) => {
    try {
      // Find which elder bucket the member is currently in
      let currentElderId: string | null = null;
      
      for (const [elderId, memberIds] of Object.entries(elderAssignments)) {
        if (memberIds.includes(memberId)) {
          currentElderId = elderId;
          break;
        }
      }

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
      if (!newAssignments[targetElderId].includes(memberId)) {
        newAssignments[targetElderId].push(memberId);
      }
      
      setElderAssignments(newAssignments);

      // If moving to unassigned, just delete the assignment
      if (targetElderId === "unassigned") {
        if (currentElderId !== "unassigned") {
          const { error } = await supabase
            .from("member_under_elder")
            .delete()
            .match({ member_id: memberId });

          if (error) throw error;
        }
      } else {
        // Check if there's an existing assignment
        if (currentElderId !== "unassigned") {
          // Update existing assignment
          const { error } = await supabase
            .from("member_under_elder")
            .update({ elder_id: targetElderId })
            .match({ member_id: memberId });

          if (error) throw error;
        } else {
          // Create new assignment
          const { error } = await supabase
            .from("member_under_elder")
            .insert({ member_id: memberId, elder_id: targetElderId });

          if (error) throw error;
        }
      }

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

  const getMembersForElder = (elderId: string) => {
    const memberIds = elderAssignments[elderId] || [];
    return members.filter(member => memberIds.includes(member.id));
  };

  const handleMemberAdded = () => {
    // Refresh the data after a new member is added
    fetchData();
  };

  if (loading) {
    return <div className="p-8">Loading elder and member data...</div>;
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

      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <ElderBucket
              elderId="unassigned"
              elderName="Unassigned Members"
              members={getMembersForElder("unassigned")}
              onMemberDrop={handleMemberDrop}
            />
          </div>

          {elders.map((elder) => (
            <div key={elder.id} className="col-span-1">
              <ElderBucket
                elderId={elder.id}
                elderName={elder.name || "Unknown Elder"}
                members={getMembersForElder(elder.id)}
                onMemberDrop={handleMemberDrop}
              />
            </div>
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

export default MemberManager;
