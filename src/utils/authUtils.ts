
import { supabase } from '@/integrations/supabase/client';
import { Member } from '@/types/database.types';
import { UserRole } from '@/types/auth.types';
import { updateMemberRole as updateRole } from '@/lib/memberService';

/**
 * Retrieves a member profile from the database by user ID
 * @param userId The user ID to fetch the profile for
 * @returns The member profile or null if not found
 */
export const fetchMemberProfile = async (userId: string | undefined): Promise<Member | null> => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*, roles(*)')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching member profile:', error);
      return null;
    }
    
    // Cast to Member type after ensuring data conforms to the type structure
    return data as unknown as Member;
  } catch (error) {
    console.error('Unexpected error in fetchMemberProfile:', error);
    return null;
  }
};

/**
 * Determines the user's role from their profile data
 * @param profile The member profile
 * @returns The determined user role or null if it cannot be determined
 */
export const determineUserRole = (profile: Member | null): UserRole | null => {
  if (!profile) return null;
  
  if (profile.roles?.name) {
    return profile.roles.name as UserRole;
  } 
  
  if (profile.role) {
    return profile.role as UserRole;
  }
  
  return 'member'; // Default role if none is specified
};

/**
 * Updates the member's role ID if it's missing
 * @param userId The user ID
 * @param roleName The role name to set
 * @returns True if successful, false otherwise
 */
export const syncMemberRoleId = async (
  userId: string, 
  roleName: UserRole
): Promise<boolean> => {
  if (!userId || !roleName) return false;
  
  try {
    await updateRole(userId, roleName);
    return true;
  } catch (error) {
    console.error('Error synchronizing member role ID:', error);
    return false;
  }
};

/**
 * Fetches a user profile and determines their role
 * @param userId The user ID to fetch the profile for
 * @returns Object containing the profile and role
 */
export const fetchUserProfile = async (userId: string | undefined): Promise<{
  profile: Member | null;
  role: UserRole | null;
}> => {
  if (!userId) return { profile: null, role: null };
  
  try {
    // Fetch the member profile
    const profile = await fetchMemberProfile(userId);
    
    // Determine the user's role
    const roleName = determineUserRole(profile);
    
    // Sync role ID if needed
    if (roleName && profile && !profile.role_id) {
      await syncMemberRoleId(userId, roleName);
    }
    
    return { profile, role: roleName };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return { profile: null, role: null };
  }
};

/**
 * Checks if a user has permission based on their role
 * @param userRole The user's role
 * @param allowedRoles Array of roles that have permission
 * @returns True if the user has permission, false otherwise
 */
export const hasPermission = (userRole: UserRole | null, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  
  // Admin has access to everything
  if (userRole === 'admin') return true;
  
  // Check if the user's role is in the allowed roles list
  return allowedRoles.includes(userRole);
};
