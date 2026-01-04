import { motion } from 'framer-motion';
import { Bell, Check, UserPlus, X } from 'lucide-react';

interface ActivityItemProps {
  type: 'invitation_received' | 'invitation_accepted' | 'invitation_rejected' | 'match';
  message: string;
  time: string;
  index?: number;
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

export function ActivityItem({ type, message, time, index = 0 }: ActivityItemProps) {
  const Icon = icons[type];

  return (
    <motion.div 
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ x: -4 }}
    >
      <motion.div 
        className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColors[type]}`}
        whileHover={{ scale: 1.1 }}
      >
        <Icon className="w-4 h-4" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{message}</p>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
    </motion.div>
  );
}
