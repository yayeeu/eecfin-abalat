
import React from 'react';
import { Member } from '@/types/database.types';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color = 'bg-slate-100' }) => (
  <div className={`${color} rounded-lg shadow p-4 text-center`}>
    <div className="text-lg font-semibold text-gray-700">{label}</div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
  </div>
);

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
const memberTypeColors: Record<string, string> = {
  'member': 'bg-blue-50',
  'regular': 'bg-green-50',
  'visitor': 'bg-purple-50',
  'remote': 'bg-orange-50',
  // Default color for any other types
  'default': 'bg-slate-100'
};

const MemberMetrics: React.FC<{ 
  members: Member[], 
  myMembers?: Member[] 
}> = ({ members, myMembers = [] }) => {
  // Group members by their member_type_id
  const groupMembersByType = (membersList: Member[]): MemberTypeCount[] => {
    const counts: Record<string, { count: number; name: string }> = {};
    
    // Count members by type
    membersList.forEach(member => {
      const typeId = member.member_type_id || 'unknown';
      if (!counts[typeId]) {
        // Use the member_type_id as the name fallback since member_type_name doesn't exist
        const typeName = typeId; // Using typeId as fallback
        counts[typeId] = { count: 0, name: typeName };
      }
      counts[typeId].count += 1;
    });
    
    // Convert to array format
    return Object.entries(counts).map(([id, { count, name }]) => ({
      id,
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
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
        <Card className="overflow-hidden">
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

        {/* UNDER MY CARE - Always show this section */}
        <Card className="overflow-hidden">
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
