
import React from 'react';
import { Member, ContactLog } from '@/types/database.types';
import { Users, User, Calendar, Clock } from 'lucide-react';
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
  
  // Count logs in each period
  const thisWeekCount = contactLogs.filter(log => {
    const logDate = new Date(log.created_at || '');
    return isWithinInterval(logDate, { start: thisWeekStart, end: thisWeekEnd });
  }).length;
  
  const lastWeekCount = contactLogs.filter(log => {
    const logDate = new Date(log.created_at || '');
    return isWithinInterval(logDate, { start: lastWeekStart, end: lastWeekEnd });
  }).length;
  
  // Period data for rendering
  const contactLogPeriods: ContactLogPeriod[] = [
    { 
      label: 'This Week', 
      count: thisWeekCount, 
      icon: Clock,
      color: 'bg-green-100 text-green-700'
    },
    { 
      label: 'Last Week', 
      count: lastWeekCount, 
      icon: Calendar,
      color: 'bg-blue-100 text-blue-700'
    },
  ];
  
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
          {contactLogPeriods.map((period, index) => (
            <div 
              key={index} 
              className={`rounded-lg p-4 ${period.color} flex flex-col items-center justify-center text-center`}
            >
              <period.icon className="h-8 w-8 mb-2" />
              <div className="text-2xl font-bold">{period.count}</div>
              <div className="text-xs font-medium">{period.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElderCareMetrics;
