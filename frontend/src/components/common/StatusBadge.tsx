import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = status.toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (norm.includes('verified') || norm.includes('approved') || norm.includes('compliant') || norm.includes('on time')) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (norm.includes('pending') || norm.includes('progress') || norm.includes('review')) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (norm.includes('flagged') || norm.includes('mismatch') || norm.includes('delayed') || norm.includes('anomaly')) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (norm.includes('rejected') || norm.includes('critical') || norm.includes('insufficient')) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${sizeClasses} ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};
