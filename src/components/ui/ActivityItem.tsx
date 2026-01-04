import { Bell, Check, UserPlus, X } from 'lucide-react';

interface ActivityItemProps {
  type: 'invitation_received' | 'invitation_accepted' | 'invitation_rejected' | 'match';
  message: string;
  time: string;
}

const icons = {
  invitation_received: UserPlus,
  invitation_accepted: Check,
  invitation_rejected: X,
  match: Bell,
};

const iconColors = {
  invitation_received: 'text-primary bg-accent',
  invitation_accepted: 'text-success bg-success/10',
  invitation_rejected: 'text-destructive bg-destructive/10',
  match: 'text-warning bg-warning/10',
};

export function ActivityItem({ type, message, time }: ActivityItemProps) {
  const Icon = icons[type];

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColors[type]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{message}</p>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
    </div>
  );
}
