
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Define simple interfaces to avoid deep type instantiation
export interface SimpleMember {
  id: string;
  name?: string;
  email?: string;
}

export interface SimpleElder {
  id: string;
  name: string;
}

export type ElderAssignmentsMap = {[key: string]: string[]};

export const useElderAssignments = () => {
  const [elders, setElders] = useState<SimpleElder[]>([]);
  const [members, setMembers] = useState<SimpleMember[]>([]);
  const [elderAssignments, setElderAssignments] = useState<ElderAssignmentsMap>({
    unassigned: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all members with elder role using a specific query
      const eldersResult = await supabase
        .from("members")
        .select("id, name")
        .eq("role", "elder");

      if (eldersResult.error) throw eldersResult.error;

      // Fetch all regular members (non-elders)
      const membersResult = await supabase
        .from("members")
        .select("id, name, email")
        .neq("role", "elder"); // Exclude elders from general members list

      if (membersResult.error) throw membersResult.error;

      // Fetch current elder assignments
      const assignmentsResult = await supabase
        .from("member_under_elder")
        .select("elder_id, member_id");

      if (assignmentsResult.error) throw assignmentsResult.error;

      // Process the data
      setElders(eldersResult.data || []);
      setMembers(membersResult.data || []);

      // Create initial assignments map
      const assignments: ElderAssignmentsMap = { unassigned: [] };
      
      // Initialize assignments for each elder
      eldersResult.data?.forEach((elder) => {
        assignments[elder.id] = [];
      });

      // Add members to their assigned elders
      assignmentsResult.data?.forEach((assignment) => {
        if (assignments[assignment.elder_id]) {
          assignments[assignment.elder_id].push(assignment.member_id);
        }
      });

      // Find unassigned members
      const assignedMemberIds = assignmentsResult.data?.map(a => a.member_id) || [];
      const unassignedMembers = membersResult.data?.filter(
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
