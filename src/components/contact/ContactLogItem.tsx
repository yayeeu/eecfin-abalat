
import React from 'react';
import { ContactLog } from '@/types/database.types';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ContactLogItemProps {
  log: ContactLog;
  onEdit: (log: ContactLog) => void;
  onDelete: (logId: string) => void;
}

const ContactLogItem: React.FC<ContactLogItemProps> = ({ log, onEdit, onDelete }) => {
  const memberTypeColors = {
    'regular': 'bg-purple-100 text-purple-800',
    'new': 'bg-green-100 text-green-800',
    'visitor': 'bg-blue-100 text-blue-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'elder': 'bg-yellow-100 text-yellow-800'
  } as const;

  return (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-grow">
            <div className="truncate">
              <span className="font-medium">{log.member?.name}</span>
              {log.member?.role && (
                <Badge className={`ml-2 ${memberTypeColors[log.member.role as keyof typeof memberTypeColors] || 'bg-gray-100'}`}>
                  {log.member.role}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
              <Badge variant="outline">{log.contact_type}</Badge>
              <span className="hidden sm:inline">•</span>
              {log.member?.phone && <span className="hidden sm:inline">📞 {log.member.phone}</span>}
              {log.member?.email && <span className="hidden sm:inline">📧 {log.member.email}</span>}
              <span className="hidden sm:inline">•</span>
              <span>{log.created_at && formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
              {log.flagged && <Badge variant="destructive">Flagged</Badge>}
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(log)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(log.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {log.notes && (
          <p className="text-sm mt-1 text-muted-foreground line-clamp-1">{log.notes}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactLogItem;
