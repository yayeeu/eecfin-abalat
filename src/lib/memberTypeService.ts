
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// Mock data for development mode
const mockMemberTypes = [
  { id: '1', created_at: new Date().toISOString(), name: 'Regular Member' },
  { id: '2', created_at: new Date().toISOString(), name: 'Visitor' },
  { id: '3', created_at: new Date().toISOString(), name: 'Associate Member' },
  { id: '4', created_at: new Date().toISOString(), name: 'Covenant Member' }
];

// Mock data for member counts by type
const mockMembersByType = [
  { typeId: '1', count: 45 },
  { typeId: '2', count: 12 },
  { typeId: '3', count: 8 },
  { typeId: '4', count: 23 }
];

// Get all member types
export const getMemberTypes = async () => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured()) {
    console.log('Using mock data for member types');
    return Promise.resolve(mockMemberTypes);
  }
  
  const { data, error } = await supabase!
    .from('member_type')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching member types:', error);
    throw error;
  }
  
  return data;
};

// Get count of members by type
export const getMembersByType = async () => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured()) {
    console.log('Using mock data for members by type');
    return Promise.resolve(mockMembersByType);
  }
  
  const { data, error } = await supabase!
    .from('members')
    .select('member_type_id, count')
    .not('member_type_id', 'is', null)
    .group('member_type_id');
  
  if (error) {
    console.error('Error fetching members by type:', error);
    throw error;
  }
  
  return data.map(item => ({
    typeId: item.member_type_id,
    count: parseInt(item.count)
  }));
};

// Create a new member type
export const createMemberType = async (name: string) => {
  // If Supabase is not configured, use mock data
  if (!isSupabaseConfigured()) {
    const newType = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      name
    };
    mockMemberTypes.push(newType);
    return Promise.resolve(newType);
  }
  
  const { data, error } = await supabase!
    .from('member_type')
    .insert({ name })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating member type:', error);
    throw error;
  }
  
  return data;
};

// Delete a member type
export const deleteMemberType = async (id: string) => {
  // If Supabase is not configured, use mock data
  if (!isSupabaseConfigured()) {
    const index = mockMemberTypes.findIndex(t => t.id === id);
    if (index !== -1) {
      mockMemberTypes.splice(index, 1);
    }
    return Promise.resolve(true);
  }
  
  const { error } = await supabase!
    .from('member_type')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting member type:', error);
    throw error;
  }
  
  return true;
};
