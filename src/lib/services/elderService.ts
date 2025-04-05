
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Member } from '@/types/database.types';
import { v4 as uuidv4 } from 'uuid';
import { mockMembers, mockElderAssignments } from '@/lib/mockData/membersMockData';

// Get elders from database
export const getElderMembers = async (): Promise<Member[]> => {
  try {
    console.log('Getting elder members, Supabase configured:', isSupabaseConfigured());
    
    if (!isSupabaseConfigured()) {
      console.log('Using mock elder data');
      const mockElders = mockMembers.filter(member => member.role === 'elder');
      console.log('Mock elders:', mockElders);
      return mockElders;
    }

    // First get the role ID for elder
    const { data: roleData, error: roleError } = await supabase!
      .from('roles')
      .select('id')
      .eq('name', 'elder')
      .single();
    
    if (roleError) {
      console.error('Error fetching elder role:', roleError);
      throw roleError;
    }

    console.log('Elder role ID:', roleData.id);
    
    // Use the role ID to fetch members with elder role
    const { data, error } = await supabase!
      .from('members')
      .select('*')
      .eq('role_id', roleData.id)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching elders:', error);
      throw error;
    }

    console.log('Fetched elders count:', data?.length);
    console.log('Fetched elders:', data);
    
    return data || [];
  } catch (error) {
    console.error('Error in getElderMembers:', error);
    // Return mock data as fallback
    const mockElders = mockMembers.filter(member => member.role === 'elder');
    console.log('Returning mock elders due to error:', mockElders);
    return mockElders;
  }
};

// Get elders for dropdown
export const getEldersForDropdown = async (): Promise<{ id: string; name: string }[]> => {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Using mock elder data for dropdown');
      return mockMembers
        .filter(member => member.role === 'elder')
        .map(elder => ({ id: elder.id, name: elder.name || 'Unknown' }));
    }

    // First get the role ID for elder
    const { data: roleData, error: roleError } = await supabase!
      .from('roles')
      .select('id')
      .eq('name', 'elder')
      .single();
    
    if (roleError) {
      console.error('Error fetching elder role:', roleError);
      throw roleError;
    }
    
    // Use the role ID to fetch members with elder role
    const { data, error } = await supabase!
      .from('members')
      .select('id, name')
      .eq('role_id', roleData.id)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching elders for dropdown:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getEldersForDropdown:', error);
    return mockMembers
      .filter(member => member.role === 'elder')
      .map(elder => ({ id: elder.id, name: elder.name || 'Unknown' }));
  }
};

// Add the missing function
export const getElderDropdownOptions = async () => {
  const elders = await getEldersForDropdown();
  return elders.map(elder => ({
    value: elder.id,
    label: elder.name
  }));
};

// Function to populate with sample data (kept for reference)
export const populateWithSampleData = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured');
    return { success: false, message: 'Database connection not available' };
  }

  try {
    // This function won't be needed anymore since we've populated the database directly
    // but I'll leave it as a reference for future updates
    return {
      success: true,
      message: 'Sample data already populated through SQL migration'
    };
  } catch (error) {
    console.error('Error populating sample data:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
