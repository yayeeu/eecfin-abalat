
import React from 'react';
import { Member, ContactLog } from '@/types/database.types';
import { Users, User, Calendar, Clock, Phone, Mail, MessageSquare, Users2 } from 'lucide-react';
import { format, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface MemberTypeCount {
  id: string;
  name: string | null;
  count: number;
}

interface ContactLogPeriod {
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
}

const ElderCareMetrics: React.FC<{ 
  members: Member[]; 
  contactLogs: ContactLog[];
  elderId?: string;
}> = ({ 
  members,
  contactLogs,
  elderId
}) => {
  // Fetch member types from database
  const { data: memberTypes = [], isLoading } = useQuery({
    queryKey: ['memberTypesForElder', elderId],
    queryFn: async () => {
      // Get all member types
      const { data: types, error: typesError } = await supabase
        .from('member_type')
        .select('id, name');
      
      if (typesError) {
        console.error('Error fetching member types:', typesError);
        return [];
      }
      
      // Calculate counts for each member type
      return types.map(type => {
        const count = members.filter(m => m.member_type_id === type.id).length;
        return { ...type, count };
      });
    },
  });
  
  // Calculate total members assigned to the elder
  const totalAssignedMembers = members.length;
  
  // Calculate contact log periods
  const now = new Date();
  const thisWeekStart = startOfWeek(now);
  const thisWeekEnd = endOfWeek(now);
  const lastWeekStart = startOfWeek(subWeeks(now, 1));
  const lastWeekEnd = endOfWeek(subWeeks(now, 1));
  
  // Filter logs for each period
  const thisWeekLogs = contactLogs.filter(log => {
    const logDate = new Date(log.created_at || '');
    return isWithinInterval(logDate, { start: thisWeekStart, end: thisWeekEnd });
  });
  
  const lastWeekLogs = contactLogs.filter(log => {
    const logDate = new Date(log.created_at || '');
    return isWithinInterval(logDate, { start: lastWeekStart, end: lastWeekEnd });
  });

  // Process logs by member type
  const getLogsByMemberType = (logs: ContactLog[]) => {
    const countByType: Record<string, number> = {};
    
    logs.forEach(log => {
      if (log.member_id) {
        const member = members.find(m => m.id === log.member_id);
        if (member && member.member_type_id) {
          countByType[member.member_type_id] = (countByType[member.member_type_id] || 0) + 1;
        }
      }
    });
    
    return memberTypes.map(type => ({
      ...type,
      logCount: countByType[type.id] || 0
    }));
  };
  
  // Process logs by contact type
  const getLogsByContactType = (logs: ContactLog[]) => {
    const countByType: Record<string, number> = {};
    
    logs.forEach(log => {
      if (log.contact_type) {
        countByType[log.contact_type] = (countByType[log.contact_type] || 0) + 1;
      }
    });
    
    return Object.entries(countByType).map(([type, count]) => ({ type, count }));
  };
  
  // Get logs by member type for each period
  const thisWeekByMemberType = getLogsByMemberType(thisWeekLogs);
  const lastWeekByMemberType = getLogsByMemberType(lastWeekLogs);
  
  // Get logs by contact type for each period
  const thisWeekByContactType = getLogsByContactType(thisWeekLogs);
  const lastWeekByContactType = getLogsByContactType(lastWeekLogs);
  
  // Contact types with corresponding icons
  const contactTypeIcons: Record<string, React.ElementType> = {
    'Phone Call': Phone,
    'Text Message': MessageSquare,
    'Email': Mail,
    'In Person': Users2,
  };
  
  // Generate an array of colors for member types
  const typeColors = [
    'bg-blue-100 text-blue-700',
    'bg-amber-100 text-amber-700',
    'bg-indigo-100 text-indigo-700',
    'bg-emerald-100 text-emerald-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700',
    'bg-orange-100 text-orange-700',
    'bg-violet-100 text-violet-700',
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="bg-amber-50 text-amber-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold">{totalAssignedMembers}</div>
          <div className="text-sm font-medium">Total Members Assigned</div>
        </div>
        
        {/* Member Types Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Members by Type</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {isLoading ? (
              <div className="col-span-full text-center py-2">Loading member types...</div>
            ) : memberTypes.length === 0 ? (
              <div className="col-span-full text-center py-2 text-gray-500">No member types defined</div>
            ) : (
              memberTypes.map((type, index) => (
                <div 
                  key={type.id} 
                  className={`rounded-lg p-3 ${typeColors[index % typeColors.length]} flex flex-col items-center justify-center text-center`}
                >
                  <User className="h-6 w-6 mb-1" />
                  <div className="text-lg font-bold">{type.count}</div>
                  <div className="text-xs font-medium">{type.name || 'Unnamed Type'}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Contact Log Activity Section */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">My Recent Activity</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* This Week Section */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="text-center font-medium mb-3 bg-green-100 text-green-700 py-1 rounded">This Week</h4>
            <div className="space-y-4">
              {/* By Member Type */}
              <div>
                <h5 className="text-xs font-medium text-gray-500 mb-2">By Member Type</h5>
                <div className="grid grid-cols-2 gap-2">
                  {thisWeekByMemberType.length === 0 ? (
                    <div className="col-span-2 text-center py-2 text-xs text-gray-400">No contact logs</div>
                  ) : (
                    thisWeekByMemberType.map((item, index) => (
                      item.logCount > 0 && (
                        <div 
                          key={`thisweek-${item.id}`} 
                          className={`rounded-lg p-2 ${typeColors[index % typeColors.length]} flex flex-col items-center justify-center text-center`}
                        >
                          <div className="text-sm font-bold">{item.logCount}</div>
                          <div className="text-xs">{item.name || 'Unnamed'}</div>
                        </div>
                      )
                    ))
                  )}
                </div>
              </div>
              
              {/* By Contact Type */}
              <div>
                <h5 className="text-xs font-medium text-gray-500 mb-2">By Contact Type</h5>
                <div className="grid grid-cols-2 gap-2">
                  {thisWeekByContactType.length === 0 ? (
                    <div className="col-span-2 text-center py-2 text-xs text-gray-400">No contact logs</div>
                  ) : (
                    thisWeekByContactType.map((item, index) => {
                      const IconComponent = contactTypeIcons[item.type] || MessageSquare;
                      return (
                        <div 
                          key={`thisweek-${item.type}`} 
                          className="rounded-lg p-2 bg-gray-100 flex flex-col items-center justify-center text-center"
                        >
                          <IconComponent className="h-3 w-3 mb-1" />
                          <div className="text-sm font-bold">{item.count}</div>
                          <div className="text-xs">{item.type}</div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Last Week Section */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="text-center font-medium mb-3 bg-blue-100 text-blue-700 py-1 rounded">Last Week</h4>
            <div className="space-y-4">
              {/* By Member Type */}
              <div>
                <h5 className="text-xs font-medium text-gray-500 mb-2">By Member Type</h5>
                <div className="grid grid-cols-2 gap-2">
                  {lastWeekByMemberType.length === 0 ? (
                    <div className="col-span-2 text-center py-2 text-xs text-gray-400">No contact logs</div>
                  ) : (
                    lastWeekByMemberType.map((item, index) => (
                      item.logCount > 0 && (
                        <div 
                          key={`lastweek-${item.id}`} 
                          className={`rounded-lg p-2 ${typeColors[index % typeColors.length]} flex flex-col items-center justify-center text-center`}
                        >
                          <div className="text-sm font-bold">{item.logCount}</div>
                          <div className="text-xs">{item.name || 'Unnamed'}</div>
                        </div>
                      )
                    ))
                  )}
                </div>
              </div>
              
              {/* By Contact Type */}
              <div>
                <h5 className="text-xs font-medium text-gray-500 mb-2">By Contact Type</h5>
                <div className="grid grid-cols-2 gap-2">
                  {lastWeekByContactType.length === 0 ? (
                    <div className="col-span-2 text-center py-2 text-xs text-gray-400">No contact logs</div>
                  ) : (
                    lastWeekByContactType.map((item, index) => {
                      const IconComponent = contactTypeIcons[item.type] || MessageSquare;
                      return (
                        <div 
                          key={`lastweek-${item.type}`} 
                          className="rounded-lg p-2 bg-gray-100 flex flex-col items-center justify-center text-center"
                        >
                          <IconComponent className="h-3 w-3 mb-1" />
                          <div className="text-sm font-bold">{item.count}</div>
                          <div className="text-xs">{item.type}</div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElderCareMetrics;
