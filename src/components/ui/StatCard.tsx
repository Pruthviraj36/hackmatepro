import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  progress?: number;
}

export function StatCard({ title, value, icon, subtitle, progress }: StatCardProps) {
  return (
    <div className="card-base p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <span className="text-2xl font-bold text-foreground">{value}</span>
      </div>
      <h3 className="font-medium text-foreground mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
