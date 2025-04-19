
import React from 'react';
import { Member } from '@/types/database.types';
import { Card, CardContent } from '@/components/ui/card';

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

interface MemberStats {
  total: number;
  members: number;
  regulars: number;
  visitors: number;
  remote: number;
}

const MemberMetrics: React.FC<{ 
  members: Member[], 
  myMembers?: Member[] 
}> = ({ members, myMembers }) => {
  // Calculate total stats
  const totalStats: MemberStats = {
    total: members.length,
    members: members.filter(m => m.member_type_id === 'member').length,
    regulars: members.filter(m => m.member_type_id === 'regular').length,
    visitors: members.filter(m => m.member_type_id === 'visitor').length,
    remote: members.filter(m => m.member_type_id === 'remote').length,
  };

  // Calculate stats for members under my care
  const myCareStats: MemberStats | null = myMembers ? {
    total: myMembers.length,
    members: myMembers.filter(m => m.member_type_id === 'member').length,
    regulars: myMembers.filter(m => m.member_type_id === 'regular').length,
    visitors: myMembers.filter(m => m.member_type_id === 'visitor').length,
    remote: myMembers.filter(m => m.member_type_id === 'remote').length,
  } : null;

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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Members" value={totalStats.members} color="bg-blue-50" />
              <StatCard label="Regulars" value={totalStats.regulars} color="bg-green-50" />
              <StatCard label="Visitors" value={totalStats.visitors} color="bg-purple-50" />
              <StatCard label="Remote" value={totalStats.remote} color="bg-orange-50" />
            </div>
          </CardContent>
        </Card>

        {/* UNDER MY CARE */}
        {myCareStats && (
          <Card className="overflow-hidden">
            <div className="bg-green-600 p-4 text-white text-center">
              <h3 className="text-xl font-semibold">UNDER MY CARE</h3>
              <div className="text-4xl font-bold mt-2">{myCareStats.total}</div>
            </div>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Members" value={myCareStats.members} color="bg-blue-50" />
                <StatCard label="Regulars" value={myCareStats.regulars} color="bg-green-50" />
                <StatCard label="Visitors" value={myCareStats.visitors} color="bg-purple-50" />
                <StatCard label="Remote" value={myCareStats.remote} color="bg-orange-50" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemberMetrics;
