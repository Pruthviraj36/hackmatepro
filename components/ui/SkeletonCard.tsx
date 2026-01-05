import { motion } from 'framer-motion';

export function SkeletonUserCard() {
  return (
    <div className="card-base p-5">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-muted rounded-full animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-muted rounded w-24 animate-pulse" />
          <div className="h-4 bg-muted rounded w-full animate-pulse" />
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-16 bg-muted rounded-full animate-pulse" />
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
            <div className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="card-base p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
        <div className="w-12 h-8 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-5 w-32 bg-muted rounded animate-pulse mb-2" />
      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
    </div>
  );
}

export function SkeletonProfileHeader() {
  return (
    <div className="card-base p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-24 h-24 bg-muted rounded-full animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-3">
            <div className="h-7 w-32 bg-muted rounded animate-pulse" />
            <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-28 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonSection({ rows = 3 }: { rows?: number }) {
  return (
    <div className="card-base p-6">
      <div className="h-6 w-24 bg-muted rounded animate-pulse mb-4" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded animate-pulse" style={{ width: `${100 - i * 15}%` }} />
        ))}
      </div>
    </div>
  );
}
