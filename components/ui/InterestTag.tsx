interface InterestTagProps {
  name: string;
  removable?: boolean;
  onRemove?: () => void;
}

export function InterestTag({ name, removable, onRemove }: InterestTagProps) {
  return (
    <span className="tag-interest inline-flex items-center gap-1">
      {name}
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
