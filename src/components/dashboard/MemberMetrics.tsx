
import React from 'react';
import { Member } from '@/types/database.types';
import { Users, User, UserCheck, Baby } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface MemberType {
  id: string;
  name: string | null;
  count: number;
}

const MemberMetrics: React.FC<{ members: Member[] }> = ({ members }) => {
  // Calculate basic metrics
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const inactiveMembers = totalMembers - activeMembers;
  
  // Calculate total children for active members
  const totalChildren = members
    .filter(m => m.status === 'active')
    .reduce((sum, member) => sum + (member.num_children || 0), 0);
  
  // Fetch member types from database
  const { data: memberTypes = [], isLoading } = useQuery({
    queryKey: ['memberTypes'],
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
  
  // Basic metrics cards data
  const metrics = [
    { icon: Users, label: 'Total Members', value: totalMembers, color: 'bg-red-100 text-red-700' },
    { icon: UserCheck, label: 'Active', value: activeMembers, color: 'bg-green-100 text-green-700' },
    { icon: User, label: 'Inactive', value: inactiveMembers, color: 'bg-gray-100 text-gray-700' },
    { icon: Baby, label: 'Children', value: totalChildren, color: 'bg-purple-100 text-purple-700' },
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className={`rounded-lg p-4 ${metric.color} flex flex-col items-center justify-center text-center`}>
            <metric.icon className="h-8 w-8 mb-2" />
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="text-xs font-medium">{metric.label}</div>
          </div>
        ))}
      </div>
      
      {/* Member Types Section */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Member Types</h3>
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
  );
};

export default MemberMetrics;
