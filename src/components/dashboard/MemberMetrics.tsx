import React from 'react';
import { Member } from '@/types/database.types';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMemberTypes } from '@/lib/services/memberTypeService';

// Enhanced StatCard component with more dynamic styling
const StatCard: React.FC<{ 
  label: string; 
  value: number; 
  color?: string 
}> = ({ label, value, color = 'bg-slate-100' }) => (
  <div className={`
    ${color} 
    rounded-xl 
    shadow-md 
    p-4 
    text-center 
    transition-all 
    duration-300 
    hover:scale-105 
    hover:shadow-lg
    group
  `}>
    <div className="text-sm font-medium text-gray-600 mb-1 group-hover:text-gray-800 transition-colors">
      {label}
    </div>
    <div className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
      {value}
    </div>
  </div>
);

// Predefined color palette for member types
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

// Map member types to colors
const memberTypeColorsOld: Record<string, string> = {
  'member': 'bg-blue-50',
  'regular': 'bg-green-50',
  'visitor': 'bg-purple-50',
  'remote': 'bg-orange-50',
  // Default color for any other types
  'default': 'bg-slate-100'
};

// Map of member type IDs to readable names
const memberTypeNames: Record<string, string> = {
  // These would typically come from the database, but we'll use some defaults
  // as fallbacks for common member types
  'regular': 'Regular',
  'visitor': 'Visitor',
  'member': 'Member',
  'remote': 'Remote',
};

const MemberMetrics: React.FC<{ 
  members: Member[], 
  myMembers?: Member[] 
}> = ({ members, myMembers = [] }) => {
  // Fetch member types from the database
  const { data: memberTypes } = useQuery({
    queryKey: ['memberTypes'],
    queryFn: getMemberTypes,
    staleTime: 30 * 60 * 1000, // 30 minutes cache
  });

  // Group members by their member_type_id
  const groupMembersByType = (membersList: Member[]) => {
    const counts: Record<string, { count: number; name: string }> = {};
    
    // Count members by type
    membersList.forEach(member => {
      const typeId = member.member_type_id || 'unknown';
      if (!counts[typeId]) {
        // Find the name of the member type from the fetched types
        const memberType = memberTypes?.find(type => type.id === typeId);
        const typeName = memberType?.name || 
                          (typeId === 'unknown' ? 'Unknown' : 
                          typeId.charAt(0).toUpperCase() + typeId.slice(1));
        counts[typeId] = { count: 0, name: typeName };
      }
      counts[typeId].count += 1;
    });
    
    // Convert to array format
    return Object.entries(counts).map(([id, { count, name }]) => ({
      id,
      name,
      count,
      color: memberTypeColors[id.toLowerCase()] || memberTypeColors.default
    }));
  };

  // Calculate total stats
  const totalStats: MemberStats = {
    total: members.length,
    typeBreakdown: groupMembersByType(members)
  };

  // Calculate stats for members under my care
  const myCareStats: MemberStats = {
    total: myMembers.length,
    typeBreakdown: groupMembersByType(myMembers)
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TOTAL in EECFIN */}
        <Card className="overflow-hidden animate-fade-in">
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

        {/* UNDER MY CARE */}
        <Card className="overflow-hidden animate-fade-in">
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
      </div>
    </div>
  );
};

export default MemberMetrics;
