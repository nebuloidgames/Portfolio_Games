import React from 'react';

/**
 * Progress Bar matching reference design:
 * PROGRESS label on left, percentage on right, thin #4A1513 border with maroon fill
 */
export default function ProgressBar({ current = 1, total = 10 }) {
  const percent = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div className="w-full max-w-lg mx-auto mb-2 px-2">
      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#4A1513] mb-1">
        <span>PROGRESS</span>
        <span className="font-mono">{percent}%</span>
      </div>

      <div className="h-2.5 w-full bg-white/60 rounded-full overflow-hidden p-0.5 border border-[#4A1513] shadow-xs">
        <div
          className="h-full rounded-full bg-[#4A1513] transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

