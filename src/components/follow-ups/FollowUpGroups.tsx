
import React, { useMemo } from 'react';
import { ContactLog, Member } from '@/types/database.types';
import { format, subWeeks, isAfter, isBefore, startOfDay } from 'date-fns';
import MembersTable from '@/components/members/MembersTable';

interface FollowUpGroupsProps {
  contactLogs: ContactLog[];
}

// Helper function to convert ContactLog to Member for the MembersTable
const contactLogToMember = (log: ContactLog): Member => {
  return {
    id: log.member?.id || log.member_id,
    name: log.member?.name || 'Unknown',
    phone: log.member?.phone,
    email: log.member?.email,
    status: log.member?.status,
    address: log.member?.address,
    flagged: log.flagged,
    // Add other required properties with default values
    role: log.member?.role || 'member',
  };
};

const FollowUpGroups: React.FC<FollowUpGroupsProps> = ({ contactLogs }) => {
  // Group contact logs by time periods
  const groupedContacts = useMemo(() => {
    const today = startOfDay(new Date());
    const oneWeekAgo = subWeeks(today, 1);
    const twoWeeksAgo = subWeeks(today, 2);
    const threeWeeksAgo = subWeeks(today, 3);
    const fourWeeksAgo = subWeeks(today, 4);
    
    // Initialize groups
    const groups = {
      thisWeek: [] as Member[],
      lastWeek: [] as Member[],
      twoWeeksAgo: [] as Member[],
      threeWeeksAgo: [] as Member[],
      fourWeeksAgo: [] as Member[],
      older: [] as Member[],
    };
    
    // Process each contact log
    contactLogs.forEach(log => {
      if (!log.created_at) return;
      
      const contactDate = new Date(log.created_at);
      
      // Add to the appropriate group based on date
      if (isAfter(contactDate, oneWeekAgo)) {
        if (!groups.thisWeek.some(m => m.id === log.member_id)) {
          groups.thisWeek.push(contactLogToMember(log));
        }
      } else if (isAfter(contactDate, twoWeeksAgo)) {
        if (!groups.lastWeek.some(m => m.id === log.member_id)) {
          groups.lastWeek.push(contactLogToMember(log));
        }
      } else if (isAfter(contactDate, threeWeeksAgo)) {
        if (!groups.twoWeeksAgo.some(m => m.id === log.member_id)) {
          groups.twoWeeksAgo.push(contactLogToMember(log));
        }
      } else if (isAfter(contactDate, fourWeeksAgo)) {
        if (!groups.threeWeeksAgo.some(m => m.id === log.member_id)) {
          groups.threeWeeksAgo.push(contactLogToMember(log));
        }
      } else if (isBefore(contactDate, fourWeeksAgo)) {
        if (!groups.fourWeeksAgo.some(m => m.id === log.member_id)) {
          groups.fourWeeksAgo.push(contactLogToMember(log));
        }
      } else {
        if (!groups.older.some(m => m.id === log.member_id)) {
          groups.older.push(contactLogToMember(log));
        }
      }
    });
    
    return groups;
  }, [contactLogs]);
  
  // Display placeholder if no contacts
  if (contactLogs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-600">No contact logs found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters or add new contact logs</p>
      </div>
    );
  }
  
  // Handlers for member actions (required by MembersTable)
  const handleMemberClick = (memberId: string) => {
    console.log('Member clicked:', memberId);
  };
  
  const handleViewDetails = (member: Member) => {
    console.log('View details:', member);
  };
  
  const handleEditMember = (memberId: string) => {
    console.log('Edit member:', memberId);
  };
  
  return (
    <div className="space-y-8">
      {groupedContacts.thisWeek.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">This Week</h2>
          <MembersTable 
            members={groupedContacts.thisWeek}
            onMemberClick={handleMemberClick}
            onViewDetails={handleViewDetails}
            onEditMember={handleEditMember}
            readOnly={true}
          />
        </section>
      )}
      
      {groupedContacts.lastWeek.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Last Week</h2>
          <MembersTable 
            members={groupedContacts.lastWeek}
            onMemberClick={handleMemberClick}
            onViewDetails={handleViewDetails}
            onEditMember={handleEditMember}
            readOnly={true}
          />
        </section>
      )}
      
      {groupedContacts.twoWeeksAgo.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">2 Weeks Ago</h2>
          <MembersTable 
            members={groupedContacts.twoWeeksAgo}
            onMemberClick={handleMemberClick}
            onViewDetails={handleViewDetails}
            onEditMember={handleEditMember}
            readOnly={true}
          />
        </section>
      )}
      
      {groupedContacts.threeWeeksAgo.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">3 Weeks Ago</h2>
          <MembersTable 
            members={groupedContacts.threeWeeksAgo}
            onMemberClick={handleMemberClick}
            onViewDetails={handleViewDetails}
            onEditMember={handleEditMember}
            readOnly={true}
          />
        </section>
      )}
      
      {groupedContacts.fourWeeksAgo.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">4 Weeks Ago</h2>
          <MembersTable 
            members={groupedContacts.fourWeeksAgo}
            onMemberClick={handleMemberClick}
            onViewDetails={handleViewDetails}
            onEditMember={handleEditMember}
            readOnly={true}
          />
        </section>
      )}
      
      {groupedContacts.older.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Older</h2>
          <MembersTable 
            members={groupedContacts.older}
            onMemberClick={handleMemberClick}
            onViewDetails={handleViewDetails}
            onEditMember={handleEditMember}
            readOnly={true}
          />
        </section>
      )}
    </div>
  );
};

export default FollowUpGroups;
