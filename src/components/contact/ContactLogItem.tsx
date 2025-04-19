
import React from 'react';
import { ContactLog } from '@/types/database.types';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{log.member?.name}</h3>
              {log.member?.role && (
                <Badge className={memberTypeColors[log.member.role as keyof typeof memberTypeColors] || 'bg-gray-100'}>
                  {log.member.role}
                </Badge>
              )}
              {log.flagged && (
                <Badge variant="destructive">Flagged</Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {log.member?.phone && <div>📞 {log.member.phone}</div>}
              {log.member?.email && <div>📧 {log.member.email}</div>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(log)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(log.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{log.contact_type}</Badge>
            <span className="text-sm text-muted-foreground">
              {log.created_at && formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
            </span>
          </div>
          {log.notes && (
            <p className="text-sm mt-2">{log.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactLogItem;
