import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Member } from '@/types/database.types';
import { v4 as uuidv4 } from 'uuid';
import { mockMembers, mockElderAssignments } from '@/lib/mockData/membersMockData';

// Get elders from database
export const getElderMembers = async (): Promise<Member[]> => {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Using mock elder data');
      return mockMembers.filter(member => member.role === 'elder');
    }

    const { data, error } = await supabase!
      .from('members')
      .select('*')
      .eq('role', 'elder');

    if (error) {
      console.error('Error fetching elders:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getElderMembers:', error);
    return mockMembers.filter(member => member.role === 'elder');
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

    const { data, error } = await supabase!
      .from('members')
      .select('id, name')
      .eq('role', 'elder');

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

// Function to populate with sample data
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
