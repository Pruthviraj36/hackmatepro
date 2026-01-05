interface SkillTagProps {
  name: string;
  proficiency?: 'Basic' | 'Intermediate' | 'Expert';
  removable?: boolean;
  onRemove?: () => void;
}

export function SkillTag({ name, proficiency, removable, onRemove }: SkillTagProps) {
  return (
    <span className="tag-skill inline-flex items-center gap-1">
      {name}
      {proficiency && (
        <span className="text-xs opacity-70">• {proficiency}</span>
      )}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:text-destructive transition-colors"
        >
          ×
        </button>
      )}
    </span>
  );
}
