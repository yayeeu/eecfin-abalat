
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Member } from '@/types/database.types';
import { v4 as uuidv4 } from 'uuid';
import { mockMembers } from '@/lib/mockData/membersMockData';

// Basic CRUD operations for members

export const getAllMembers = async () => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured()) {
    console.log('Using mock data for all members');
    return Promise.resolve(mockMembers);
  }
  
  console.log('Fetching members from Supabase');
  const { data, error } = await supabase!
    .from('members')
    .select(`
      *, 
      roles(id, name),
      assigned_elder:member_under_elder!member_id(
        id,
        elder_id,
        elder:members!member_under_elder_elder_id_fkey(
          id, 
          name
        )
      )
    `)
    .order('name');
  
  if (error) {
    console.error('Error fetching all members:', error);
    throw error;
  }
  
  console.log(`Fetched ${data.length} members from Supabase:`, data);
  return data as Member[];
};

export const getMember = async (id: string) => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured()) {
    const member = mockMembers.find(m => m.id === id);
    if (!member) {
      throw new Error('Member not found');
    }
    return Promise.resolve(member);
  }
  
  const { data, error } = await supabase!
    .from('members')
    .select(`
      *, 
      ministries(id, name), 
      roles(id, name),
      assigned_elder:member_under_elder!member_id(
        id,
        elder_id,
        elder:members!member_under_elder_elder_id_fkey(id, name)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching member:', error);
    throw error;
  }
  
  return data as Member;
};

export const createMember = async (member: Omit<Member, 'id' | 'created_at'>) => {
  // If Supabase is not configured, use mock data
  if (!isSupabaseConfigured()) {
    const newMember: Member = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      ...member
    };
    mockMembers.push(newMember);
    return Promise.resolve(newMember);
  }
  
  const { data, error } = await supabase!
    .from('members')
    .insert(member)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating member:', error);
    throw error;
  }
  
  return data as Member;
};

export const updateMember = async (id: string, member: Partial<Omit<Member, 'id' | 'created_at'>>) => {
  // If Supabase is not configured, use mock data
  if (!isSupabaseConfigured()) {
    const index = mockMembers.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Member not found');
    }
    
    const updatedMember = {
      ...mockMembers[index],
      ...member
    };
    mockMembers[index] = updatedMember;
    return Promise.resolve(updatedMember);
  }
  
  const { data, error } = await supabase!
    .from('members')
    .update(member)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating member:', error);
    throw error;
  }
  
  return data as Member;
};

export const deleteMember = async (id: string) => {
  // If Supabase is not configured, use mock data
  if (!isSupabaseConfigured()) {
    const index = mockMembers.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Member not found');
    }
    mockMembers.splice(index, 1);
    return Promise.resolve(true);
  }
  
  const { error } = await supabase!
    .from('members')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
  
  return true;
};
