
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { mockMembers } from '@/lib/mockData/membersMockData';

// Get members for dropdown selects (used in ministry form)
export const getMembersForDropdown = async () => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured()) {
    console.log('Using mock data for members dropdown');
    return Promise.resolve(mockMembers
      .filter(m => m.status === 'active')
      .map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone, // Include phone in the returned data
        status: m.status
      }))
    );
  }
  
  const { data, error } = await supabase!
    .from('members')
    .select('id, name, email, phone, status') // Include phone in the select query
    .eq('status', 'active')
    .order('name');
  
  if (error) {
    console.error('Error fetching members for dropdown:', error);
    throw error;
  }
  
  return data;
};

// Add the missing function for dropdown options
export const getMemberDropdownOptions = async () => {
  const members = await getMembersForDropdown();
  return members.map(member => ({
    value: member.id,
    label: member.name || 'Unknown'
  }));
};
