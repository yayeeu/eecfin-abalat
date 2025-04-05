
import { supabase } from "@/integrations/supabase/client";
import { ElderAssignmentsMap } from "@/hooks/useElderAssignments";

export const updateMemberAssignment = async (
  memberId: string, 
  targetElderId: string, 
  currentElderId: string | null
): Promise<void> => {
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
};

export const findCurrentElderId = (
  memberId: string, 
  elderAssignments: ElderAssignmentsMap
): string | null => {
  for (const [elderId, memberIds] of Object.entries(elderAssignments)) {
    if (memberIds.includes(memberId)) {
      return elderId;
    }
  }
  return null;
};
