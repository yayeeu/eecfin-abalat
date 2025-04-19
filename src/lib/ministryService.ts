import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Ministry as DBMinistry } from '@/types/database.types';
import { v4 as uuidv4 } from 'uuid';

// Export the Ministry type so it can be imported in other files
export type Ministry = DBMinistry;

// Mock data for development mode
const mockMinistries: Ministry[] = [
  {
    id: '1',
    name: 'Worship Team',
    description: 'Leading the congregation in worship through music and song.',
    contact_name: 'Daniel Bekele',
    contact_email: 'worship@example.com',
    contact_phone: '+358 40 123 4567',
    status: 'active',
    created_at: new Date().toISOString(),
    contact_person_id: '1'
  },
  {
    id: '2',
    name: 'Children\'s Ministry',
    description: 'Nurturing the spiritual growth of our youngest members through age-appropriate teaching and activities.',
    contact_name: 'Sara Tadesse',
    contact_email: 'children@example.com',
    status: 'active',
    created_at: new Date().toISOString(),
    contact_person_id: '2'
  },
  {
    id: '3',
    name: 'Prayer Team',
    description: 'Dedicated to praying for the needs of the church, community, and world.',
    contact_name: 'Elias Girma',
    contact_email: 'prayer@example.com',
    contact_phone: '+358 50 987 6543',
    status: 'active',
    created_at: new Date().toISOString(),
    contact_person_id: '3'
  }
];

export const getMinistries = async (activeOnly = false) => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured()) {
    console.log('Using mock data for ministries');
    let filteredMinistries = [...mockMinistries];
    if (activeOnly) {
      filteredMinistries = filteredMinistries.filter(m => m.status === 'active');
    }
    return Promise.resolve(filteredMinistries);
  }
  
  let query = supabase!
    .from('ministries')
    .select(`
      *,
      members!members_ministry_id_fkey(id, name, email, phone)
    `);
  
  if (activeOnly) {
    query = query.eq('status', 'active');
  }

  query = query.order('name');
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching ministries:', error);
    throw error;
  }
  
  return data as Ministry[];
};

export const getActiveMinistryCount = async () => {
  if (!isSupabaseConfigured()) {
    const count = mockMinistries.filter(m => m.status === 'active').length;
    return Promise.resolve({ count });
  }

  const { count, error } = await supabase!
    .from('ministries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  if (error) {
    console.error('Error counting active ministries:', error);
    throw error;
  }

  return { count };
};

export const getMinistry = async (id: string) => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured()) {
    const ministry = mockMinistries.find(m => m.id === id);
    if (!ministry) {
      throw new Error('Ministry not found');
    }
    return Promise.resolve(ministry);
  }
  
  const { data, error } = await supabase!
    .from('ministries')
    .select('*, members!members_ministry_id_fkey(id, name, email, phone)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching ministry:', error);
    throw error;
  }
  
  return data as Ministry;
};

export const createMinistry = async (ministry: Omit<Ministry, 'id' | 'created_at'>) => {
  // If Supabase is not configured, use mock data
  if (!isSupabaseConfigured()) {
    const newMinistry: Ministry = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      ...ministry
    };
    mockMinistries.push(newMinistry);
    return Promise.resolve(newMinistry);
  }
  
  const { data, error } = await supabase!
    .from('ministries')
    .insert(ministry)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating ministry:', error);
    throw error;
  }
  
  return data as Ministry;
};

export const updateMinistry = async (id: string, ministry: Partial<Omit<Ministry, 'id' | 'created_at'>>) => {
  // If Supabase is not configured, use mock data
  if (!isSupabaseConfigured()) {
    const index = mockMinistries.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Ministry not found');
    }
    
    const updatedMinistry = {
      ...mockMinistries[index],
      ...ministry
    };
    mockMinistries[index] = updatedMinistry;
    return Promise.resolve(updatedMinistry);
  }
  
  const { data, error } = await supabase!
    .from('ministries')
    .update(ministry)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating ministry:', error);
    throw error;
  }
  
  return data as Ministry;
};

export const deleteMinistry = async (id: string) => {
  // If Supabase is not configured, use mock data
  if (!isSupabaseConfigured()) {
    const index = mockMinistries.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Ministry not found');
    }
    mockMinistries.splice(index, 1);
    return Promise.resolve(true);
  }
  
  const { error } = await supabase!
    .from('ministries')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting ministry:', error);
    throw error;
  }
  
  return true;
};
