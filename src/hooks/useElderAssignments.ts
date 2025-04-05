
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Member } from "@/types/database.types";

// Define simple interfaces for elders
export interface SimpleElder {
  id: string;
  name: string;
}

// Use a simpler type definition for the assignments map
export type ElderAssignmentsMap = Record<string, string[]>;

export const useElderAssignments = () => {
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
      
      // Fetch all members with elder role using a specific query
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", "elder")
        .single();

      if (roleError) {
        console.error("Error fetching elder role:", roleError);
        throw new Error("Elder role not found");
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

      // Fetch all members (without filtering by role to get everything)
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
      setMembers(typedMembers);

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

  return {
    elders,
    members,
    elderAssignments,
    loading,
    fetchData,
    setElderAssignments
  };
};
