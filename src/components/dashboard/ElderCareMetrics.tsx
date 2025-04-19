import React from 'react';
import { Member, ContactLog } from '@/types/database.types';
import { Phone, MessageSquare } from 'lucide-react';
import { 
  startOfWeek, endOfWeek, subWeeks, isWithinInterval,
  startOfToday 
} from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ActivityStats {
  totalContacted: number;
  contacts: {
    'Phone calls': number;
    'Text messages': number;
    'Face to face': number;
  };
  memberTypes: Record<string, number>;
}

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
  displaySummary = true,
}) => {
  const getStatsForPeriod = (startDate: Date, endDate: Date, logs: ContactLog[]) => {
    const periodLogs = logs.filter(log => {
      const logDate = new Date(log.created_at || '');
      return isWithinInterval(logDate, { start: startDate, end: endDate });
    });

    const stats: ActivityStats = {
      totalContacted: new Set(periodLogs.map(log => log.member_id)).size,
      contacts: {
        'Phone calls': periodLogs.filter(log => log.contact_type === 'Phone Call').length,
        'Text messages': periodLogs.filter(log => log.contact_type === 'Text Message').length,
        'Face to face': periodLogs.filter(log => log.contact_type === 'In Person').length,
      },
      memberTypes: {}
    };

    periodLogs.forEach(log => {
      const member = members.find(m => m.id === log.member_id);
      const memberType = member?.member_type_id || 'unknown';
      stats.memberTypes[memberType] = (stats.memberTypes[memberType] || 0) + 1;
    });

    return stats;
  };

  const now = new Date();
  const thisWeekStart = startOfWeek(now);
  const thisWeekEnd = startOfToday();
  const lastWeekStart = startOfWeek(subWeeks(now, 1));
  const lastWeekEnd = endOfWeek(subWeeks(now, 1));

  const thisWeekStats = getStatsForPeriod(thisWeekStart, thisWeekEnd, contactLogs);
  const lastWeekStats = getStatsForPeriod(lastWeekStart, lastWeekEnd, contactLogs);

  const renderStatsSection = (title: string, stats: ActivityStats) => (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-xl font-semibold text-center mb-4">{title}</h3>
      <div className="grid gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{stats.totalContacted}</div>
          <div className="text-sm text-muted-foreground">Total contacted</div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <Phone className="h-4 w-4 mx-auto mb-1 text-blue-600" />
            <div className="text-xl font-semibold">{stats.contacts['Phone calls']}</div>
            <div className="text-xs">Phone calls</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <MessageSquare className="h-4 w-4 mx-auto mb-1 text-green-600" />
            <div className="text-xl font-semibold">{stats.contacts['Text messages']}</div>
            <div className="text-xs">Text messages</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="text-xl font-semibold">{stats.contacts['Face to face']}</div>
            <div className="text-xs">Face to face</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {Object.entries(stats.memberTypes).map(([type, count], index) => (
            <div key={type} className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold">{count}</div>
              <div className="text-xs">{type === 'unknown' ? 'Other' : type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Your recent activity</h2>
          {renderStatsSection('This week', thisWeekStats)}
          {renderStatsSection('Last week', lastWeekStats)}
        </div>

        {displayAllActivities && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Elders' activity</h2>
            {renderStatsSection('This week', thisWeekStats)}
            {renderStatsSection('Last week', lastWeekStats)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElderCareMetrics;
