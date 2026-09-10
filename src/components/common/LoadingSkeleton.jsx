import React from 'react';

// Shimmering Table Skeleton Placeholder
export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden p-6 space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 rounded-md w-48" />
          <div className="h-3 bg-slate-100 rounded-md w-72" />
        </div>
        <div className="h-9 bg-slate-200 rounded-xl w-32" />
      </div>

      {/* Table rows skeleton */}
      <div className="space-y-3 pt-2">
        <div className="h-8 bg-slate-100 rounded-lg w-full" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            {Array.from({ length: cols }).map((_, j) => (
              <div 
                key={j} 
                className="h-4 bg-slate-200/70 rounded-md flex-1" 
                style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Shimmering Metric Cards Skeleton
export function MetricCardsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 bg-slate-200 rounded w-24" />
            <div className="w-8 h-8 rounded-lg bg-slate-200" />
          </div>
          <div className="h-7 bg-slate-300 rounded w-16" />
          <div className="h-2.5 bg-slate-100 rounded w-32" />
        </div>
      ))}
    </div>
  );
}

// Shimmering Detail Card Skeleton
export function DetailCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-200" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-300 rounded w-48" />
          <div className="h-3.5 bg-slate-200 rounded w-64" />
        </div>
      </div>
      <div className="h-24 bg-slate-100 rounded-xl" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-12 bg-slate-200/70 rounded-xl" />
        <div className="h-12 bg-slate-200/70 rounded-xl" />
        <div className="h-12 bg-slate-200/70 rounded-xl" />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ type = 'table', ...props }) {
  if (type === 'metrics') return <MetricCardsSkeleton {...props} />;
  if (type === 'card') return <DetailCardSkeleton {...props} />;
  return <TableSkeleton {...props} />;
}
