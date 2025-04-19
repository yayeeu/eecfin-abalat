
import React from 'react';
import { ContactLog } from '@/types/database.types';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users,
  CalendarDays,
  UserCheck,
  Clock
} from 'lucide-react';

interface Elder {
  id: string;
  name: string;
  logs: ContactLog[];
  assignedMembers: { id: string; name: string; }[];
}

interface GroupedContactLogsProps {
  elders: Elder[];
  onMemberClick?: (memberId: string) => void;
}

const GroupedContactLogs: React.FC<GroupedContactLogsProps> = ({ 
  elders,
  onMemberClick 
}) => {
  const sortedElders = [...elders].sort((a, b) => {
    const aLatestLog = a.logs.length > 0 ? new Date(a.logs[0].created_at || '') : new Date(0);
    const bLatestLog = b.logs.length > 0 ? new Date(b.logs[0].created_at || '') : new Date(0);
    return bLatestLog.getTime() - aLatestLog.getTime();
  });

  return (
    <Accordion type="multiple" className="space-y-4">
      {sortedElders.map((elder) => {
        const groupedLogs: Record<string, ContactLog[]> = {
          'This week': [],
          'Last week': [],
          '2 Weeks ago': [],
          '3 Weeks ago': [],
          '4 Weeks ago': [],
          'More than 4 weeks': []
        };

        // Group logs by time period
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

        // Add members without logs to "More than 4 weeks"
        const loggedMemberIds = new Set(elder.logs.map(log => log.member_id));
        const membersWithoutLogs = elder.assignedMembers.filter(
          member => !loggedMemberIds.has(member.id)
        );

        membersWithoutLogs.forEach(member => {
          groupedLogs['More than 4 weeks'].push({
            id: `no-log-${member.id}`,
            elder_id: elder.id,
            member_id: member.id,
            contact_type: '',
            member: member,
            created_at: null
          } as ContactLog);
        });

        const totalContacts = elder.logs.length;

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
                    <p className="text-sm text-muted-foreground">
                      {totalContacts} contact{totalContacts !== 1 ? 's' : ''} | {elder.assignedMembers.length} members
                    </p>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[400px] px-4 py-2">
                <div className="space-y-4">
                  {Object.entries(groupedLogs).map(([period, logs]) => (
                    logs.length > 0 && (
                      <Card key={`${elder.id}-${period}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-3">
                            {period === 'More than 4 weeks' ? (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            )}
                            <h4 className="font-medium text-sm">{period}</h4>
                          </div>
                          <div className="space-y-2">
                            {logs.map(log => (
                              <div 
                                key={log.id}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                              >
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                                {log.member_id && onMemberClick ? (
                                  <button 
                                    className="text-sm text-blue-600 hover:underline"
                                    onClick={() => onMemberClick(log.member_id)}
                                  >
                                    {log.member?.name || 'Unknown Member'}
                                  </button>
                                ) : (
                                  <span className="text-sm">
                                    {log.member?.name || 'Unknown Member'}
                                  </span>
                                )}
                                {log.flagged && (
                                  <Badge variant="secondary" className="ml-auto">
                                    Flagged
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default GroupedContactLogs;
