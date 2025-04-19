
import React from 'react';
import { Member } from '@/types/database.types';

interface StatCardProps {
  label: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <div className="bg-white rounded-lg shadow p-4 text-center">
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
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-xl font-semibold text-gray-700">TOTAL in EECFIN</div>
            <div className="text-4xl font-bold text-gray-900 mt-2">{totalStats.total}</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Members" value={totalStats.members} />
            <StatCard label="Regulars" value={totalStats.regulars} />
            <StatCard label="Visitors" value={totalStats.visitors} />
            <StatCard label="Remote" value={totalStats.remote} />
          </div>
        </div>

        {/* UNDER MY CARE */}
        {myCareStats && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-xl font-semibold text-gray-700">UNDER MY CARE</div>
              <div className="text-4xl font-bold text-gray-900 mt-2">{myCareStats.total}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Members" value={myCareStats.members} />
              <StatCard label="Regulars" value={myCareStats.regulars} />
              <StatCard label="Visitors" value={myCareStats.visitors} />
              <StatCard label="Remote" value={myCareStats.remote} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberMetrics;
