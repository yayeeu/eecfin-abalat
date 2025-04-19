import React from 'react';
import { ContactLog } from '@/types/database.types';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users,
  CalendarDays,
  Clock,
  AlertCircle,
  Flag,
  Info
} from 'lucide-react';

// Member type color mapping
const memberTypeColors = {
  'regular': 'bg-purple-100 text-purple-800', // Default
  'new': 'bg-green-100 text-green-800',
  'visitor': 'bg-blue-100 text-blue-800',
  'inactive': 'bg-gray-100 text-gray-800',
  'elder': 'bg-yellow-100 text-yellow-800'
} as const;

interface Elder {
  id: string;
  name: string;
  logs: ContactLog[];
  assignedMembers: { id: string; name: string; role?: string; }[];
}

interface GroupedContactLogsProps {
  elders: Elder[];
  onMemberClick?: (memberId: string) => void;
}

const getMemberTypeColor = (role?: string) => {
  if (!role) return memberTypeColors.regular;
  const type = role.toLowerCase();
  return memberTypeColors[type as keyof typeof memberTypeColors] || memberTypeColors.regular;
};

const GroupedContactLogs: React.FC<GroupedContactLogsProps> = ({ 
  elders,
  onMemberClick 
}) => {
  const timePeriods = {
    'This week': [],
    'Last week': [],
    '2 Weeks ago': [],
    '3 Weeks ago': [],
    '4 Weeks ago': [],
    'More than 4 weeks': []
  };

  const sortedElders = [...elders].sort((a, b) => {
    const aLatestLog = a.logs.length > 0 ? new Date(a.logs[0].created_at || '') : new Date(0);
    const bLatestLog = b.logs.length > 0 ? new Date(b.logs[0].created_at || '') : new Date(0);
    return bLatestLog.getTime() - aLatestLog.getTime();
  });

  return (
    <div>
      {/* Member type key/legend */}
      <div className="mb-4 p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Member Types</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(memberTypeColors).map(([type, colorClass]) => (
            <span 
              key={type}
              className={`px-2 py-1 rounded-full text-xs capitalize ${colorClass}`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {sortedElders.map((elder) => {
          const groupedLogs = Object.keys(timePeriods).reduce((acc, period) => {
            acc[period] = [];
            return acc;
          }, {} as Record<string, ContactLog[]>);

          elder.logs.forEach(log => {
            const logDate = new Date(log.created_at || '');
            const now = new Date();
            const weekDiff = Math.floor((now.getTime() - logDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

            if (weekDiff === 0) groupedLogs['This week'].push(log);
            else if (weekDiff === 1) groupedLogs['Last week'].push(log);
            else if (weekDiff === 2) groupedLogs['2 Weeks ago'].push(log);
            else if (weekDiff === 3) groupedLogs['3 Weeks ago'].push(log);
            else if (weekDiff === 4) groupedLogs['4 Weeks ago'].push(log);
            else groupedLogs['More than 4 weeks'].push(log);
          });

          const totalContacts = elder.logs.length;
          const flaggedContacts = elder.logs.filter(log => log.flagged).length;

          return (
            <AccordionItem 
              key={elder.id} 
              value={elder.id}
              className="bg-white rounded-lg border shadow-sm"
            >
              <AccordionTrigger className="px-4 py-2 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-semibold">{elder.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <p>{totalContacts} contact{totalContacts !== 1 ? 's' : ''} | {elder.assignedMembers.length} members</p>
                        {flaggedContacts > 0 && (
                          <div className="flex items-center gap-1">
                            <Flag className="h-3 w-3 text-yellow-500" />
                            <span>{flaggedContacts} flagged</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <ScrollArea className="h-[400px] px-4 py-2">
                  <div className="space-y-4">
                    {Object.entries(groupedLogs).map(([period, logs]) => (
                      <Card key={`${elder.id}-${period}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-3">
                            {period === 'More than 4 weeks' ? (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            )}
                            <h4 className="font-medium text-sm">
                              {period}
                              {logs.length === 0 && " - No members contacted"}
                            </h4>
                          </div>
                          {logs.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {logs.map(log => (
                                <button
                                  key={log.id}
                                  onClick={() => log.member_id && onMemberClick?.(log.member_id)}
                                  className={`inline-flex items-center px-2 py-1 rounded text-sm transition-colors ${getMemberTypeColor(log.member?.role)}`}
                                >
                                  {log.member?.name || 'Unknown Member'}
                                  {log.flagged && (
                                    <AlertCircle className="h-3 w-3 ml-1 text-yellow-500" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default GroupedContactLogs;
