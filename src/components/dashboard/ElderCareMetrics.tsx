
import React from 'react';
import { Member, ContactLog } from '@/types/database.types';
import { Phone, MessageSquare } from 'lucide-react';
import { 
  startOfWeek, endOfWeek, subWeeks, isWithinInterval,
  startOfToday 
} from 'date-fns';

interface ActivityStats {
  totalContacted: number;
  contacts: {
    'Phone Call': number;
    'Text Message': number;
    'In Person': number;
    'Email': number;
    'Other': number;
  };
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
        'Phone Call': periodLogs.filter(log => log.contact_type === 'Phone Call').length,
        'Text Message': periodLogs.filter(log => log.contact_type === 'Text Message').length,
        'In Person': periodLogs.filter(log => log.contact_type === 'In Person').length,
        'Email': periodLogs.filter(log => log.contact_type === 'Email').length,
        'Other': periodLogs.filter(log => log.contact_type === 'Other').length,
      }
    };

    return stats;
  };

  const now = new Date();
  const thisWeekStart = startOfWeek(now);
  const thisWeekEnd = startOfToday();
  const lastWeekStart = startOfWeek(subWeeks(now, 1));
  const lastWeekEnd = endOfWeek(subWeeks(now, 1));

  // Filter logs by elderId if provided
  const filteredLogs = elderId 
    ? contactLogs.filter(log => log.elder_id === elderId)
    : contactLogs;

  const thisWeekStats = getStatsForPeriod(thisWeekStart, thisWeekEnd, filteredLogs);
  const lastWeekStats = getStatsForPeriod(lastWeekStart, lastWeekEnd, filteredLogs);

  const renderStatsSection = (title: string, stats: ActivityStats) => (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-xl font-semibold text-center mb-4">{title}</h3>
      <div className="grid gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{stats.totalContacted}</div>
          <div className="text-sm text-muted-foreground">Members Contacted</div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <Phone className="h-4 w-4 mx-auto mb-1 text-blue-600" />
            <div className="text-xl font-semibold">{stats.contacts['Phone Call']}</div>
            <div className="text-xs">Phone calls</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <MessageSquare className="h-4 w-4 mx-auto mb-1 text-green-600" />
            <div className="text-xl font-semibold">{stats.contacts['Text Message']}</div>
            <div className="text-xs">Text messages</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="text-xl font-semibold">{stats.contacts['In Person']}</div>
            <div className="text-xs">Face to face</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-amber-50 rounded-lg">
            <div className="text-xl font-semibold">{stats.contacts['Email']}</div>
            <div className="text-xs">Emails</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xl font-semibold">{stats.contacts['Other']}</div>
            <div className="text-xs">Other contacts</div>
          </div>
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
