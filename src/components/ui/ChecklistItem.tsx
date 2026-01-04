import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ChecklistItemProps {
  text: string;
  completed: boolean;
  onClick?: () => void;
  index?: number;
}

export function ChecklistItem({ text, completed, onClick, index = 0 }: ChecklistItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
        completed
          ? 'bg-accent/50 text-foreground'
          : 'bg-muted/50 hover:bg-muted text-muted-foreground'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className={`w-5 h-5 rounded-full flex items-center justify-center ${
          completed ? 'bg-primary' : 'border-2 border-muted-foreground'
        }`}
        initial={false}
        animate={completed ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {completed && <Check className="w-3 h-3 text-primary-foreground" />}
      </motion.div>
      <span className={completed ? 'line-through' : ''}>{text}</span>
    </motion.button>
  );
}
