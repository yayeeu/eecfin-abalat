
import React from 'react';
import { Member, Ministry } from '@/types/database.types';
import { useQuery } from '@tanstack/react-query';
import { getActiveMinistryCount } from '@/lib/ministryService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const MinistryStats: React.FC<{ 
  ministries: Ministry[]; 
  members: Member[];
  elders: Member[]; 
}> = ({ 
  ministries, 
  members,
  elders 
}) => {
  const { data: ministryCount, isLoading: countLoading } = useQuery({
    queryKey: ['activeMinistryCount'],
    queryFn: getActiveMinistryCount,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
  
  // Count members by ministry
  const membersByMinistry = ministries.map(ministry => {
    const count = members.filter(m => m.ministry_id === ministry.id).length;
    return {
      name: ministry.name,
      members: count,
      fill: '#8B5CF6' // Using Vivid Purple from the theme
    };
  });
  
  // Sort by number of members (descending)
  membersByMinistry.sort((a, b) => b.members - a.members);
  
  console.log('Active ministry count:', ministryCount); // Debug log
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-around bg-purple-50 text-purple-900 rounded-lg p-4">
        <div className="text-center">
          <div className="text-3xl font-bold">
            {!countLoading && ministryCount?.count !== undefined ? ministryCount.count : '-'}
          </div>
          <div className="text-sm font-medium">Active Ministries</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{elders.length}</div>
          <div className="text-sm font-medium">Church Elders</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">
            {ministries.length > 0 ? (members.length / ministries.length).toFixed(1) : '0'}
          </div>
          <div className="text-sm font-medium">Avg. Members Per Ministry</div>
        </div>
      </div>
      
      <div>
        <h3 className="text-center font-medium mb-2 text-purple-900">Members by Ministry</h3>
        <div className="h-[300px]">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={membersByMinistry}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fontSize: 12 }} 
                  interval={0}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="members" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default MinistryStats;
