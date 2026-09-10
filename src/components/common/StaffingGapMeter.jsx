import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { calculateRoleGap, calculateFulfillmentPct, getGapBadgeInfo } from '../../utils/gapEngine';

export function GapStatusBadge({ gap, size = 'sm' }) {
  const info = getGapBadgeInfo(gap);

  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-full border ${info.badgeClass} ${
      size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
    }`}>
      {info.isFulfilled ? (
        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
      ) : (
        <AlertTriangle className={`w-3 h-3 shrink-0 ${gap === 1 ? 'text-amber-600' : 'text-rose-600'}`} />
      )}
      <span>{info.label}</span>
    </span>
  );
}

export default function StaffingGapMeter({ requiredCount = 0, allocatedCount = 0, width = 'w-36' }) {
  const gap = calculateRoleGap(requiredCount, allocatedCount);
  const pct = calculateFulfillmentPct(requiredCount, allocatedCount);

  // Color selection based on fulfillment percentage
  const getBarColor = () => {
    if (pct === 100) return 'bg-emerald-500';
    if (pct >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className={`${width} space-y-1`}>
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
        <span className={pct === 100 ? 'text-emerald-700' : 'text-slate-700'}>{pct}%</span>
        <span>{allocatedCount}/{requiredCount} Seats</span>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
