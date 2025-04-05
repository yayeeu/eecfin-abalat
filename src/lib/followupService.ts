
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Member } from '@/types/database.types';
import { mockMembers } from '@/lib/mockData/membersMockData';
import { subDays } from 'date-fns';

// Define the interface for members with contact status
export interface MemberWithContactStatus extends Pick<Member, 'id' | 'name'> {
  status: 'recent' | 'pending' | 'overdue' | 'none';
  lastContactDate: string | null;
  lastContactType: string | null;
}

// Mock data for development mode
const getMockMembersWithStatus = (statusFilter?: string): Promise<MemberWithContactStatus[]> => {
  const now = new Date();
  const mockData: MemberWithContactStatus[] = mockMembers.map((member, index) => {
    // Create different statuses for demonstration
    let status: 'recent' | 'pending' | 'overdue' | 'none';
    let lastContactDate: string | null;
    let lastContactType: string | null;
    
    if (index % 4 === 0) {
      status = 'recent';
      lastContactDate = subDays(now, 2).toISOString();
      lastContactType = 'Phone Call';
    } else if (index % 4 === 1) {
      status = 'pending';
      lastContactDate = subDays(now, 14).toISOString();
      lastContactType = 'Email';
    } else if (index % 4 === 2) {
      status = 'overdue';
      lastContactDate = subDays(now, 45).toISOString();
      lastContactType = 'In Person';
    } else {
      status = 'none';
      lastContactDate = null;
      lastContactType = null;
    }

    return {
      id: member.id,
      name: member.name || 'Unknown',
      status,
      lastContactDate,
      lastContactType
    };
  });

  // Filter by status if provided
  if (statusFilter) {
    return Promise.resolve(mockData.filter(member => member.status === statusFilter));
  }
  
  return Promise.resolve(mockData);
};

export const getMembersWithContactStatus = async (statusFilter?: string): Promise<MemberWithContactStatus[]> => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured()) {
    console.log('Using mock data for member contact status');
    return getMockMembersWithStatus(statusFilter);
  }

  try {
    // Calculate dates for different statuses
    const now = new Date();
    const recentDate = subDays(now, 7).toISOString(); // Last 7 days
    const pendingDate = subDays(now, 30).toISOString(); // Last 30 days
    
    // Get all members with their latest contact info
    const { data, error } = await supabase!
      .from('members')
      .select(`
        id, 
        name,
        latest_contact:contact_log(
          created_at,
          contact_type
        )
      `)
      .order('name');

    if (error) {
      console.error('Error fetching members with contact status:', error);
      throw error;
    }

    // Process the data to determine status based on latest contact
    const membersWithStatus: MemberWithContactStatus[] = data.map(member => {
      // Sort contacts by date (newest first) if there are any
      const sortedContacts = member.latest_contact ? 
        [...member.latest_contact].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) : [];
      
      const latestContact = sortedContacts.length > 0 ? sortedContacts[0] : null;
      
      // Determine status based on latest contact date
      let status: 'recent' | 'pending' | 'overdue' | 'none';
      
      if (!latestContact) {
        status = 'none';
      } else if (latestContact.created_at >= recentDate) {
        status = 'recent';
      } else if (latestContact.created_at >= pendingDate) {
        status = 'pending';
      } else {
        status = 'overdue';
      }

      return {
        id: member.id,
        name: member.name || 'Unknown',
        status,
        lastContactDate: latestContact ? latestContact.created_at : null,
        lastContactType: latestContact ? latestContact.contact_type : null
      };
    });

    // Filter by status if provided
    if (statusFilter) {
      return membersWithStatus.filter(member => member.status === statusFilter);
    }

    return membersWithStatus;
  } catch (error) {
    console.error('Error in getMembersWithContactStatus:', error);
    throw error;
  }
};
