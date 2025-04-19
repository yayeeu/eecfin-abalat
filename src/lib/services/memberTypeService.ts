
import { supabase } from "@/integrations/supabase/client";

export const getMemberTypes = async () => {
  const { data, error } = await supabase
    .from('member_type')
    .select('*');

  if (error) {
    console.error('Error fetching member types:', error);
    return [];
  }

  return data;
};
