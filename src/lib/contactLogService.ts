import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { ContactLog } from '@/types/database.types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for development mode
const mockContactLogs: ContactLog[] = [
  {
    id: '1',
    elder_id: '1', // Yeteshawork
    member_id: '6', // John Doe
    contact_type: 'Phone Call',
    notes: 'Called to check in. Member reported family is doing well.',
    flagged: false,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    elder_id: '2', // Bruke
    member_id: '7', // Jane Smith
    contact_type: 'In Person',
    notes: 'Met after church service. Discussed prayer needs.',
    flagged: true,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
];

export const getContactLogs = async (filters?: { 
  elderId?: string; 
  memberId?: string;
  flagged?: boolean;
}) => {
  if (!isSupabaseConfigured()) {
    console.log('Using mock data for contact logs');
    let filteredLogs = [...mockContactLogs];
    
    if (filters?.elderId) {
      filteredLogs = filteredLogs.filter(log => log.elder_id === filters.elderId);
    }
    
    if (filters?.memberId) {
      filteredLogs = filteredLogs.filter(log => log.member_id === filters.memberId);
    }
    
    if (filters?.flagged !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.flagged === filters.flagged);
    }
    
    return Promise.resolve(filteredLogs);
  }
  
  // First get all elders and their assigned members
  let query = supabase!
    .from('members')
    .select(`
      id,
      name,
      role,
      member_assignments:member_under_elder!elder_id(
        member:members!member_under_elder_member_id_fkey(
          id,
          name
        )
      ),
      contact_logs:contact_log!contact_log_elder_id_fkey(
        id,
        member_id,
        contact_type,
        notes,
        flagged,
        created_at,
        updated_at,
        member:members!contact_log_member_id_fkey(
          id,
          name
        )
      )
    `)
    .eq('role', 'elder')
    .order('name');
  
  const { data: elders, error: eldersError } = await query;
  
  if (eldersError) {
    console.error('Error fetching elders and contact logs:', eldersError);
    throw eldersError;
  }
  
  // Format data to include all assigned members, even those without logs
  const formattedData = elders.map(elder => {
    const assignedMembers = elder.member_assignments?.map(assignment => assignment.member) || [];
    const logs = elder.contact_logs || [];
    
    return {
      id: elder.id,
      name: elder.name,
      logs,
      assignedMembers
    };
  });
  
  return formattedData;
};

export const getContactLog = async (id: string) => {
  if (!isSupabaseConfigured()) {
    const log = mockContactLogs.find(l => l.id === id);
    if (!log) {
      throw new Error('Contact log not found');
    }
    return Promise.resolve(log);
  }
  
  const { data, error } = await supabase!
    .from('contact_log')
    .select(`
      *,
      elder:members!contact_log_elder_id_fkey(id, name),
      member:members!contact_log_member_id_fkey(id, name)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching contact log:', error);
    throw error;
  }
  
  return data as ContactLog;
};

export const createContactLog = async (log: Omit<ContactLog, 'id' | 'created_at' | 'updated_at'>) => {
  if (!isSupabaseConfigured()) {
    const newLog: ContactLog = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...log
    };
    mockContactLogs.push(newLog);
    return Promise.resolve(newLog);
  }
  
  const { data, error } = await supabase!
    .from('contact_log')
    .insert(log)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating contact log:', error);
    throw error;
  }
  
  return data as ContactLog;
};

export const updateContactLog = async (id: string, log: Partial<Omit<ContactLog, 'id' | 'created_at' | 'updated_at'>>) => {
  if (!isSupabaseConfigured()) {
    const index = mockContactLogs.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Contact log not found');
    }
    
    const updatedLog = {
      ...mockContactLogs[index],
      ...log,
      updated_at: new Date().toISOString()
    };
    mockContactLogs[index] = updatedLog;
    return Promise.resolve(updatedLog);
  }
  
  const { data, error } = await supabase!
    .from('contact_log')
    .update({
      ...log,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating contact log:', error);
    throw error;
  }
  
  return data as ContactLog;
};

export const deleteContactLog = async (id: string) => {
  if (!isSupabaseConfigured()) {
    const index = mockContactLogs.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Contact log not found');
    }
    mockContactLogs.splice(index, 1);
    return Promise.resolve(true);
  }
  
  const { error } = await supabase!
    .from('contact_log')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting contact log:', error);
    throw error;
  }
  
  return true;
};

export const getContactLogsByElderId = async (elderId: string) => {
  if (!isSupabaseConfigured()) {
    console.log('Using mock data for contact logs by elder ID');
    return Promise.resolve(mockContactLogs.filter(log => log.elder_id === elderId));
  }
  
  const { data, error } = await supabase!
    .from('contact_log')
    .select(`
      *,
      elder:members!contact_log_elder_id_fkey(id, name),
      member:members!contact_log_member_id_fkey(id, name)
    `)
    .eq('elder_id', elderId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching contact logs by elder ID:', error);
    throw error;
  }
  
  return data as ContactLog[];
};
