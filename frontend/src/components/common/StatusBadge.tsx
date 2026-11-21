import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = status.toLowerCase();

  let colorClasses = 'bg-[#F5EFE6] text-[#68625B] border-[#EAE3D9]';

  if (norm.includes('verified') || norm.includes('approved') || norm.includes('compliant') || norm.includes('on time')) {
    colorClasses = 'bg-[#EBF2EA] text-[#5B7553] border-[#5B7553]/30';
  } else if (norm.includes('pending') || norm.includes('progress') || norm.includes('review')) {
    colorClasses = 'bg-[#F5EFE6] text-[#8B5F4D] border-[#CAB4AA]';
  } else if (norm.includes('flagged') || norm.includes('mismatch') || norm.includes('delayed') || norm.includes('anomaly')) {
    colorClasses = 'bg-[#FAF0E6] text-[#A26744] border-[#E8C2B0]';
  } else if (norm.includes('rejected') || norm.includes('critical') || norm.includes('insufficient')) {
    colorClasses = 'bg-[#FDF2F2] text-[#9E3A3A] border-[#E5B5B5]';
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-sans font-medium border rounded-full ${sizeClasses} ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};
