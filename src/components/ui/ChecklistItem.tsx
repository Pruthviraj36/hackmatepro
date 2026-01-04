import { Check, Circle } from 'lucide-react';

interface ChecklistItemProps {
  text: string;
  completed: boolean;
  onClick?: () => void;
}

export function ChecklistItem({ text, completed, onClick }: ChecklistItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
        completed
          ? 'bg-accent/50 text-foreground'
          : 'bg-muted/50 hover:bg-muted text-muted-foreground'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center ${
          completed ? 'bg-primary' : 'border-2 border-muted-foreground'
        }`}
      >
        {completed && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
      <span className={completed ? 'line-through' : ''}>{text}</span>
    </button>
  );
}
