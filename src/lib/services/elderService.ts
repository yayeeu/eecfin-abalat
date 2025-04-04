
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Member } from '@/types/database.types';
import { mockMembers } from '@/lib/mockData/membersMockData';

// Get all members with role 'elder'
export const getElderMembers = async () => {
  if (!isSupabaseConfigured()) {
    console.log('Using mock elder data');
    return mockMembers.filter(m => m.role === 'elder');
  }

  const { data, error } = await supabase!
    .from('members')
    .select('*')
    .eq('role', 'elder')
    .order('name');

  if (error) {
    console.error('Error fetching elders:', error);
    throw error;
  }

  return data as Member[];
};

// Get elder list for dropdown menus
export const getEldersForDropdown = async () => {
  if (!isSupabaseConfigured()) {
    return mockMembers
      .filter(m => m.role === 'elder')
      .map(elder => ({
        id: elder.id,
        name: elder.name,
        email: elder.email
      }));
  }

  const { data, error } = await supabase!
    .from('members')
    .select('id, name, email')
    .eq('role', 'elder')
    .order('name');

  if (error) {
    console.error('Error fetching elders for dropdown:', error);
    throw error;
  }

  return data;
};
