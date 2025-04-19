
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { getMinistries } from '@/lib/ministryService';
import { ChartBar } from 'lucide-react';
import { Member } from '@/types/database.types';

const StatCard: React.FC<{ 
  label: string; 
  value: string | number; 
  color?: string 
}> = ({ label, value, color = 'bg-slate-50' }) => (
  <div className={`${color} rounded-lg p-3 text-center transition-all duration-300 hover:scale-105 hover:shadow-sm`}>
    <div className="text-sm font-medium text-gray-600">{label}</div>
    <div className="text-lg font-semibold text-gray-900">{value}</div>
  </div>
);

const MinistryMetrics: React.FC<{ totalMembers: number }> = ({ totalMembers }) => {
  const { data: ministries = [] } = useQuery({
    queryKey: ['ministries'],
    queryFn: () => getMinistries(true),
    staleTime: 30 * 60 * 1000,
  });

  // Calculate metrics
  const membersInMinistries = ministries.reduce((acc, ministry) => {
    const membersCount = ministry.members?.length || 0;
    return acc + membersCount;
  }, 0);

  const participationRate = totalMembers > 0 
    ? Math.round((membersInMinistries / totalMembers) * 100)
    : 0;

  return (
    <Card className="overflow-hidden animate-fade-in">
      <div className="bg-purple-600 p-4 text-white text-center">
        <h3 className="text-xl font-semibold">MINISTRIES</h3>
        <ChartBar className="w-6 h-6 mx-auto mt-2 opacity-75" />
      </div>
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-2">
          <StatCard 
            label="Active Ministries" 
            value={ministries.length}
            color="bg-purple-50 hover:bg-purple-100 border border-purple-200"
          />
          <StatCard 
            label="Members" 
            value={membersInMinistries}
            color="bg-blue-50 hover:bg-blue-100 border border-blue-200"
          />
          <StatCard 
            label="Participation" 
            value={`${participationRate}%`}
            color="bg-green-50 hover:bg-green-100 border border-green-200"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MinistryMetrics;
