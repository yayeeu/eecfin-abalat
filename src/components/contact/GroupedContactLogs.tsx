
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
  UserCheck
} from 'lucide-react';

interface GroupedContactLogsProps {
  groupedData: Record<string, Record<string, ContactLog[]>>;
}

const GroupedContactLogs: React.FC<GroupedContactLogsProps> = ({ groupedData }) => {
  return (
    <Accordion type="multiple" className="space-y-4">
      {Object.entries(groupedData).map(([elderId, elderLogs]) => {
        // Get elder name from first log in any time period
        const elderName = Object.values(elderLogs)[0]?.[0]?.elder?.name || 'Unknown Elder';
        const totalContacts = Object.values(elderLogs)
          .reduce((sum, logs) => sum + logs.length, 0);

        return (
          <AccordionItem 
            key={elderId} 
            value={elderId}
            className="bg-white rounded-lg border shadow-sm"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="font-semibold">{elderName}</p>
                    <p className="text-sm text-muted-foreground">
                      {totalContacts} contact{totalContacts !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[400px] px-4 py-2">
                <div className="space-y-4">
                  {Object.entries(elderLogs).map(([period, logs]) => (
                    logs.length > 0 && (
                      <Card key={`${elderId}-${period}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-3">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium text-sm">{period}</h4>
                          </div>
                          <div className="space-y-2">
                            {logs.map(log => (
                              <div 
                                key={log.id}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                              >
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {log.member?.name || 'Unknown Member'}
                                </span>
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
