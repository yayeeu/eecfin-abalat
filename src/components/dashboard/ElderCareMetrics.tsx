
import React from 'react';
import { Member, ContactLog } from '@/types/database.types';
import { 
  Users, User, Calendar, Clock, Phone, Mail, MessageSquare, 
  Users2, BarChart, PieChart, Activity, CalendarDays 
} from 'lucide-react';
import { 
  format, startOfWeek, endOfWeek, subWeeks, isWithinInterval,
  startOfMonth, endOfMonth, subMonths 
} from 'date-fns';
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

// Helper function to group contact logs by time period
const groupContactLogsByPeriod = (logs: ContactLog[]) => {
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(now);
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subWeeks(now, 1));
  const twoWeeksAgoStart = startOfWeek(subWeeks(now, 2), { weekStartsOn: 1 });
  const twoWeeksAgoEnd = endOfWeek(subWeeks(now, 2));
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  
  return {
    'This week': logs.filter(log => {
      const logDate = new Date(log.created_at || '');
      return isWithinInterval(logDate, { start: thisWeekStart, end: now });
    }),
    'Last week': logs.filter(log => {
      const logDate = new Date(log.created_at || '');
      return isWithinInterval(logDate, { start: lastWeekStart, end: lastWeekEnd });
    }),
    'Two weeks ago': logs.filter(log => {
      const logDate = new Date(log.created_at || '');
      return isWithinInterval(logDate, { start: twoWeeksAgoStart, end: twoWeeksAgoEnd });
    }),
    'This month': logs.filter(log => {
      const logDate = new Date(log.created_at || '');
      return isWithinInterval(logDate, { start: thisMonthStart, end: now });
    }),
    'Last month': logs.filter(log => {
      const logDate = new Date(log.created_at || '');
      return isWithinInterval(logDate, { start: lastMonthStart, end: lastMonthEnd });
    }),
    'Older': logs.filter(log => {
      const logDate = new Date(log.created_at || '');
      return logDate < lastMonthStart;
    })
  };
};

const ElderCareMetrics: React.FC<{ 
  members: Member[]; 
  contactLogs: ContactLog[];
  elderId?: string;
  displayAllActivities?: boolean;
  displaySummary?: boolean;
}> = ({ 
  members,
  contactLogs,
  elderId,
  displayAllActivities = false,
  displaySummary = true
}) => {
  const { data: memberTypes = [], isLoading } = useQuery({
    queryKey: ['memberTypesForElder', elderId],
    queryFn: async () => {
      const { data: types, error: typesError } = await supabase
        .from('member_type')
        .select('id, name');
      
      if (typesError) {
        console.error('Error fetching member types:', typesError);
        return [];
      }
      
      return types.map(type => {
        const count = members.filter(m => m.member_type_id === type.id).length;
        return { ...type, count };
      });
    },
  });
  
  const totalAssignedMembers = members.length;
  
  const now = new Date();
  const thisWeekStart = startOfWeek(now);
  const thisWeekEnd = endOfWeek(now);
  const lastWeekStart = startOfWeek(subWeeks(now, 1));
  const lastWeekEnd = endOfWeek(subWeeks(now, 1));
  
  const thisWeekLogs = contactLogs.filter(log => {
    const logDate = new Date(log.created_at || '');
    return isWithinInterval(logDate, { start: thisWeekStart, end: thisWeekEnd });
  });
  
  const lastWeekLogs = contactLogs.filter(log => {
    const logDate = new Date(log.created_at || '');
    return isWithinInterval(logDate, { start: lastWeekStart, end: lastWeekEnd });
  });

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
  
  const getLogsByContactType = (logs: ContactLog[]) => {
    const countByType: Record<string, number> = {};
    
    logs.forEach(log => {
      if (log.contact_type) {
        countByType[log.contact_type] = (countByType[log.contact_type] || 0) + 1;
      }
    });
    
    return Object.entries(countByType).map(([type, count]) => ({ type, count }));
  };
  
  const thisWeekByMemberType = getLogsByMemberType(thisWeekLogs);
  const lastWeekByMemberType = getLogsByMemberType(lastWeekLogs);
  
  const thisWeekByContactType = getLogsByContactType(thisWeekLogs);
  const lastWeekByContactType = getLogsByContactType(lastWeekLogs);
  
  const contactTypeIcons: Record<string, React.ElementType> = {
    'Phone Call': Phone,
    'Text Message': MessageSquare,
    'Email': Mail,
    'In Person': Users2,
  };
  
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
  
  const { data: allContactLogs = [], isLoading: allLogsLoading } = useQuery({
    queryKey: ['allContactLogs'],
    queryFn: async () => {
      if (!supabase) {
        return contactLogs;
      }
      
      const { data, error } = await supabase
        .from('contact_log')
        .select(`
          *,
          elder:members!contact_log_elder_id_fkey(id, name),
          member:members!contact_log_member_id_fkey(id, name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching all contact logs:', error);
        return [];
      }
      
      return data as ContactLog[];
    },
  });
  
  const allLogsByMemberType = getLogsByMemberType(allContactLogs);
  const allLogsByContactType = getLogsByContactType(allContactLogs);
  
  // Render the appropriate content based on what we want to display
  
  // Only display the All Activities section
  if (displayAllActivities && !displaySummary) {
    const groupedLogs = groupContactLogsByPeriod(allContactLogs);
    
    return (
      <div className="mt-2">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart className="h-5 w-5 text-purple-700 mr-2" />
                <h4 className="text-md font-semibold text-purple-800">System-wide Contact Activity</h4>
              </div>
              <div className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                {allContactLogs.length} total logs
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {Object.entries(groupedLogs).map(([period, logs]) => logs.length > 0 && (
                <div key={period} className="space-y-4">
                  <div className="flex items-center mb-3">
                    <CalendarDays className="h-5 w-5 text-indigo-600 mr-2" />
                    <h5 className="text-sm font-semibold text-gray-700">{period}</h5>
                    <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {logs.length} logs
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center mb-3">
                        <PieChart className="h-5 w-5 text-indigo-600 mr-2" />
                        <h5 className="text-sm font-semibold text-gray-700">By Member Type</h5>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {allLogsLoading ? (
                          <div className="col-span-full text-center py-4 text-gray-400">Loading data...</div>
                        ) : getLogsByMemberType(logs).length === 0 ? (
                          <div className="col-span-full text-center py-4 text-gray-400">No contact logs available</div>
                        ) : (
                          getLogsByMemberType(logs).map((item, index) => (
                            item.logCount > 0 && (
                              <div 
                                key={`${period}-${item.id}`} 
                                className={`rounded-lg p-3 ${typeColors[index % typeColors.length]} flex flex-col items-center justify-center text-center shadow-sm transition-transform hover:scale-105`}
                              >
                                <div className="text-xl font-bold">{item.logCount}</div>
                                <div className="text-xs font-medium mt-1">{item.name || 'Unnamed'}</div>
                              </div>
                            )
                          ))
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center mb-3">
                        <MessageSquare className="h-5 w-5 text-rose-600 mr-2" />
                        <h5 className="text-sm font-semibold text-gray-700">By Contact Type</h5>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {allLogsLoading ? (
                          <div className="col-span-full text-center py-4 text-gray-400">Loading data...</div>
                        ) : getLogsByContactType(logs).length === 0 ? (
                          <div className="col-span-full text-center py-4 text-gray-400">No contact logs available</div>
                        ) : (
                          getLogsByContactType(logs).map((item, index) => {
                            const IconComponent = contactTypeIcons[item.type] || MessageSquare;
                            const colorClasses = [
                              'bg-blue-50 text-blue-700 border-blue-200',
                              'bg-green-50 text-green-700 border-green-200',
                              'bg-amber-50 text-amber-700 border-amber-200',
                              'bg-rose-50 text-rose-700 border-rose-200',
                            ];
                            return (
                              <div 
                                key={`${period}-${item.type}`} 
                                className={`rounded-lg p-3 ${colorClasses[index % colorClasses.length]} border flex flex-col items-center justify-center text-center shadow-sm transition-transform hover:scale-105`}
                              >
                                <IconComponent className="h-5 w-5 mb-2" />
                                <div className="text-xl font-bold">{item.count}</div>
                                <div className="text-xs font-medium mt-1">{item.type}</div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last updated: {format(new Date(), 'MMM d, yyyy h:mm a')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Display the summary section (and possibly the all activities section too)
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="bg-amber-50 text-amber-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold">{totalAssignedMembers}</div>
          <div className="text-sm font-medium">Total Members Assigned</div>
        </div>
        
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
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">My Recent Activity</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="text-center font-medium mb-3 bg-green-100 text-green-700 py-1 rounded">This Week</h4>
            <div className="space-y-4">
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
          
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="text-center font-medium mb-3 bg-blue-100 text-blue-700 py-1 rounded">Last Week</h4>
            <div className="space-y-4">
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
