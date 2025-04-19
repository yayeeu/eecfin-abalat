
import React from 'react';
import { Member } from '@/types/database.types';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMemberTypes } from '@/lib/services/memberTypeService';
import MinistryMetrics from './MinistryMetrics';

const StatCard: React.FC<{ 
  label: string; 
  value: number; 
  color?: string 
}> = ({ label, value, color = 'bg-slate-100' }) => (
  <div className={`
    ${color} 
    rounded-xl 
    shadow-md 
    p-3  // Reduced padding
    text-center 
    transition-all 
    duration-300 
    hover:scale-105 
    hover:shadow-lg
    group
    flex
    flex-col
    justify-center
  `}>
    <div className="text-xs font-medium text-gray-600 mb-1 group-hover:text-gray-800 transition-colors truncate">
      {label}
    </div>
    <div className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
      {value}
    </div>
  </div>
);

const memberTypeColors: Record<string, string> = {
  'member': 'bg-blue-50 hover:bg-blue-100 border border-blue-200',
  'regular': 'bg-green-50 hover:bg-green-100 border border-green-200',
  'visitor': 'bg-purple-50 hover:bg-purple-100 border border-purple-200',
  'remote': 'bg-orange-50 hover:bg-orange-100 border border-orange-200',
  'default': 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
};

interface MemberTypeCount {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface MemberStats {
  total: number;
  typeBreakdown: MemberTypeCount[];
}

const memberTypeColorsOld: Record<string, string> = {
  'member': 'bg-blue-50',
  'regular': 'bg-green-50',
  'visitor': 'bg-purple-50',
  'remote': 'bg-orange-50',
  'default': 'bg-slate-100'
};

const memberTypeNames: Record<string, string> = {
  'regular': 'Regular',
  'visitor': 'Visitor',
  'member': 'Member',
  'remote': 'Remote',
};

const MemberMetrics: React.FC<{ 
  members: Member[], 
  myMembers?: Member[] 
}> = ({ members, myMembers = [] }) => {
  const { data: memberTypes } = useQuery({
    queryKey: ['memberTypes'],
    queryFn: getMemberTypes,
    staleTime: 30 * 60 * 1000,
  });

  const groupMembersByType = (membersList: Member[]) => {
    const counts: Record<string, { count: number; name: string }> = {};
    
    membersList.forEach(member => {
      const typeId = member.member_type_id || 'unknown';
      if (!counts[typeId]) {
        const memberType = memberTypes?.find(type => type.id === typeId);
        const typeName = memberType?.name || 
                          (typeId === 'unknown' ? 'Unknown' : 
                          typeId.charAt(0).toUpperCase() + typeId.slice(1));
        counts[typeId] = { count: 0, name: typeName };
      }
      counts[typeId].count += 1;
    });
    
    return Object.entries(counts).map(([id, { count, name }]) => ({
      id,
      name,
      count,
      color: memberTypeColors[id.toLowerCase()] || memberTypeColors.default
    }));
  };

  const totalStats: MemberStats = {
    total: members.length,
    typeBreakdown: groupMembersByType(members)
  };

  const myCareStats: MemberStats = {
    total: myMembers.length,
    typeBreakdown: groupMembersByType(myMembers)
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden animate-fade-in md:col-span-1">
          <div className="bg-blue-600 p-4 text-white text-center">
            <h3 className="text-xl font-semibold">TOTAL in EECFIN</h3>
            <div className="text-4xl font-bold mt-2">{totalStats.total}</div>
          </div>
          <CardContent className="pt-6">
            {totalStats.total > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {totalStats.typeBreakdown.map(type => (
                  <StatCard 
                    key={type.id} 
                    label={type.name} 
                    value={type.count} 
                    color={type.color} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No members in the database.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden animate-fade-in md:col-span-1">
          <div className="bg-green-600 p-4 text-white text-center">
            <h3 className="text-xl font-semibold">UNDER MY CARE</h3>
            <div className="text-4xl font-bold mt-2">{myCareStats.total}</div>
          </div>
          <CardContent className="pt-6">
            {myCareStats.total > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {myCareStats.typeBreakdown.map(type => (
                  <StatCard 
                    key={type.id} 
                    label={type.name} 
                    value={type.count} 
                    color={type.color} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <UserCheck className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>No members under your care.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <MinistryMetrics totalMembers={members.length} />
      </div>
    </div>
  );
};

export default MemberMetrics;
