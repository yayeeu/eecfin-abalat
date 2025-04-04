
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

// Populate database with sample data
export const populateWithSampleData = async () => {
  if (!isSupabaseConfigured()) {
    console.log('Cannot populate database: Supabase not configured');
    return { success: false, message: 'Supabase not configured' };
  }

  try {
    // Check if we already have data to avoid duplicate entries
    const { data: existingMembers, error: checkError } = await supabase!
      .from('members')
      .select('count')
      .single();

    if (checkError) {
      console.error('Error checking existing members:', checkError);
      return { success: false, message: 'Error checking existing members' };
    }

    if (existingMembers && existingMembers.count > 20) {
      return { 
        success: false, 
        message: 'Database already has data. Skipping population to avoid duplicates.' 
      };
    }

    // First, get role IDs
    const { data: roles, error: rolesError } = await supabase!
      .from('roles')
      .select('id, name');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return { success: false, message: 'Error fetching roles' };
    }

    const elderRoleId = roles?.find(r => r.name === 'elder')?.id;
    const memberRoleId = roles?.find(r => r.name === 'member')?.id;

    if (!elderRoleId || !memberRoleId) {
      return { success: false, message: 'Required roles not found in database' };
    }

    // Create ministries
    const ministries = [
      { name: 'Women\'s Ministry', description: 'Ministry focused on women', contact_name: 'Sarah Johnson', contact_email: 'sarah@example.com', status: 'active' },
      { name: 'Children\'s Ministry', description: 'Ministry focused on children', contact_name: 'David Miller', contact_email: 'david@example.com', status: 'active' },
      { name: 'Men\'s Ministry', description: 'Ministry focused on men', contact_name: 'James Wilson', contact_email: 'james@example.com', status: 'active' },
      { name: 'Choir', description: 'Church choir ministry', contact_name: 'Emma Davis', contact_email: 'emma@example.com', status: 'active' },
      { name: 'Media Team', description: 'Church media and technology', contact_name: 'Michael Brown', contact_email: 'michael@example.com', status: 'active' },
      { name: 'Outreach', description: 'Community outreach and evangelism', contact_name: 'Jessica Taylor', contact_email: 'jessica@example.com', status: 'active' }
    ];

    const { data: ministriesData, error: ministriesError } = await supabase!
      .from('ministries')
      .upsert(ministries, { onConflict: 'name' })
      .select();

    if (ministriesError) {
      console.error('Error creating ministries:', ministriesError);
      return { success: false, message: 'Error creating ministries' };
    }

    // Create elders
    const elders = [
      { name: 'Elder John Smith', email: 'john.smith@example.com', phone: '+358 40 123 4567', role: 'elder', role_id: elderRoleId, status: 'active' },
      { name: 'Elder Mary Johnson', email: 'mary.johnson@example.com', phone: '+358 50 234 5678', role: 'elder', role_id: elderRoleId, status: 'active' },
      { name: 'Elder Robert Wilson', email: 'robert.wilson@example.com', phone: '+358 45 345 6789', role: 'elder', role_id: elderRoleId, status: 'active' },
      { name: 'Elder Elizabeth Davis', email: 'elizabeth.davis@example.com', phone: '+358 40 456 7890', role: 'elder', role_id: elderRoleId, status: 'active' },
    ];

    const { data: eldersData, error: eldersError } = await supabase!
      .from('members')
      .upsert(elders, { onConflict: 'email' })
      .select();

    if (eldersError) {
      console.error('Error creating elders:', eldersError);
      return { success: false, message: 'Error creating elders' };
    }

    // Create regular members
    const members = [
      { name: 'Alice Brown', email: 'alice@example.com', phone: '+358 40 567 8901', address: 'Mannerheimintie 1, Helsinki', role: 'member', role_id: memberRoleId, status: 'active' },
      { name: 'Bob Johnson', email: 'bob@example.com', phone: '+358 50 678 9012', address: 'Aleksanterinkatu 15, Helsinki', role: 'member', role_id: memberRoleId, status: 'active' },
      { name: 'Carol Davis', email: 'carol@example.com', phone: '+358 45 789 0123', address: 'Tehtaankatu 25, Helsinki', role: 'member', role_id: memberRoleId, status: 'active' },
      { name: 'Daniel Wilson', email: 'daniel@example.com', phone: '+358 40 890 1234', address: 'Bulevardi 10, Helsinki', role: 'member', role_id: memberRoleId, status: 'active' },
      { name: 'Eva Martin', email: 'eva@example.com', phone: '+358 50 901 2345', address: 'Fredrikinkatu 30, Helsinki', role: 'member', role_id: memberRoleId, status: 'active' },
      { name: 'Frank Thomas', email: 'frank@example.com', phone: '+358 45 012 3456', address: 'Annankatu 20, Helsinki', role: 'member', role_id: memberRoleId, status: 'active' },
      { name: 'Grace Lee', email: 'grace@example.com', phone: '+358 40 123 4567', address: 'Iso Roobertinkatu 5, Helsinki', role: 'member', role_id: memberRoleId, status: 'active' },
      { name: 'Henry Clark', email: 'henry@example.com', phone: '+358 50 234 5678', address: 'Eerikinkatu 12, Helsinki', role: 'member', role_id: memberRoleId, status: 'active' },
      { name: 'Irene Walker', email: 'irene@example.com', phone: '+358 45 345 6789', address: 'Uudenmaankatu 8, Helsinki', role: 'member', role_id: memberRoleId, status: 'active' },
      { name: 'Jack Robinson', email: 'jack@example.com', phone: '+358 40 456 7890', address: 'Lönnrotinkatu 15, Helsinki', role: 'member', role_id: memberRoleId, status: 'active' },
      { name: 'Karen Wright', email: 'karen@example.com', phone: '+358 50 567 8901', address: 'Kalevankatu 25, Helsinki', role: 'member', role_id: memberRoleId, status: 'active' },
      { name: 'Leo Miller', email: 'leo@example.com', phone: '+358 45 678 9012', address: 'Hietalahdenkatu 10, Helsinki', role: 'member', role_id: memberRoleId, status: 'active' },
    ];

    const { data: membersData, error: membersError } = await supabase!
      .from('members')
      .upsert(members, { onConflict: 'email' })
      .select();

    if (membersError) {
      console.error('Error creating members:', membersError);
      return { success: false, message: 'Error creating members' };
    }

    // Assign members to elders randomly
    if (eldersData && membersData) {
      const elderAssignments = [];
      for (const member of membersData) {
        // Random elder assignment (80% chance of assignment)
        if (Math.random() < 0.8) {
          const randomElderIndex = Math.floor(Math.random() * eldersData.length);
          elderAssignments.push({
            member_id: member.id,
            elder_id: eldersData[randomElderIndex].id
          });
        }
      }

      if (elderAssignments.length > 0) {
        const { error: assignmentError } = await supabase!
          .from('member_under_elder')
          .upsert(elderAssignments, { onConflict: 'member_id' });

        if (assignmentError) {
          console.error('Error assigning members to elders:', assignmentError);
          return { success: false, message: 'Error assigning members to elders' };
        }
      }
    }

    // Assign members to ministries randomly
    if (ministriesData && membersData) {
      const ministryAssignments = [];
      for (const member of membersData.concat(eldersData || [])) {
        // Randomly assign 0-2 ministries per member
        const assignmentCount = Math.floor(Math.random() * 3); // 0, 1, or 2
        
        // Create a copy of ministry indices to avoid duplicate assignments
        const availableMinistries = [...Array(ministriesData.length).keys()];
        
        for (let i = 0; i < assignmentCount; i++) {
          if (availableMinistries.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableMinistries.length);
            const ministryIndex = availableMinistries.splice(randomIndex, 1)[0];
            
            ministryAssignments.push({
              member_id: member.id,
              ministry_id: ministriesData[ministryIndex].id
            });
          }
        }
      }

      if (ministryAssignments.length > 0) {
        const { error: ministryAssignmentError } = await supabase!
          .from('member_ministry')
          .upsert(ministryAssignments, { onConflict: 'member_id, ministry_id' });

        if (ministryAssignmentError) {
          console.error('Error assigning members to ministries:', ministryAssignmentError);
          return { success: false, message: 'Error assigning members to ministries' };
        }
      }
    }

    return { 
      success: true, 
      message: `Successfully populated database with ${elders.length} elders, ${members.length} members, and ${ministries.length} ministries.` 
    };
  } catch (error) {
    console.error('Error populating database:', error);
    return { success: false, message: 'Error populating database' };
  }
};
