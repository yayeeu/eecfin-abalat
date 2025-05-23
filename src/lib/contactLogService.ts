
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
  myLogs?: boolean;
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
    
    if (filters?.myLogs) {
      // In mock mode, just return all logs for now
      return Promise.resolve(filteredLogs);
    }
    
    return Promise.resolve(filteredLogs);
  }
  
  try {
    // If we're fetching my logs, we need a different query
    if (filters?.myLogs) {
      const { data: currentUser } = await supabase!.auth.getUser();
      
      const { data, error } = await supabase!
        .from('contact_log')
        .select(`
          *,
          elder:members!contact_log_elder_id_fkey(id, name),
          member:members!contact_log_member_id_fkey(
            id,
            name,
            role_id(
              id,
              name
            )
          )
        `)
        .eq('elder_id', currentUser.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to include a "role" field based on role_id.name
      const transformedData = data.map(log => ({
        ...log,
        member: log.member ? {
          ...log.member,
          role: log.member.role_id?.name || 'regular'
        } : null
      }));
      
      return transformedData;
    }

    // Get the elder role ID
    const elderRoleId = await getRoleIdByName('elder');
    console.log('Elder role ID:', elderRoleId);

    // First get all elders and their assigned members
    let query = supabase!
      .from('members')
      .select(`
        id,
        name,
        role_id,
        member_assignments:member_under_elder!elder_id(
          member:members!member_under_elder_member_id_fkey(
            id,
            name,
            role_id(
              id,
              name
            )
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
            name,
            role_id(
              id,
              name
            )
          )
        )
      `)
      .eq('role_id', elderRoleId) // Use the retrieved elder role ID
      .order('name');
    
    const { data: elders, error: eldersError } = await query;
    
    if (eldersError) {
      console.error('Error fetching elders and contact logs:', eldersError);
      throw eldersError;
    }
    
    console.log('Fetched elders:', elders);
    
    // Format data to include all assigned members, even those without logs
    const formattedData = elders.map(elder => {
      const assignedMembers = elder.member_assignments?.map(assignment => {
        return {
          id: assignment.member.id,
          name: assignment.member.name,
          role: assignment.member.role_id?.name || 'regular'
        };
      }) || [];
      
      const logs = elder.contact_logs?.map(log => ({
        ...log,
        member: log.member ? {
          ...log.member,
          role: log.member.role_id?.name || 'regular'
        } : null
      })) || [];
      
      return {
        id: elder.id,
        name: elder.name,
        logs,
        assignedMembers
      };
    });
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching contact logs:', error);
    throw error;
  }
};

// Helper function to get role ID by name
async function getRoleIdByName(roleName: string) {
  if (!isSupabaseConfigured()) {
    // For mock data, return a string ID
    return 'elder-role-id';
  }
  
  const { data, error } = await supabase!
    .from('roles')
    .select('id')
    .eq('name', roleName)
    .single();
  
  if (error) {
    console.error('Error fetching role ID:', error);
    throw error;
  }
  
  return data?.id;
}

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
