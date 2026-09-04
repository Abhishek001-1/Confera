import React from 'react';

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const styles: Record<BadgeVariant, string> = {
  default: 'bg-[#161923] text-[#8b8fa8] border border-[#252839]',
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  danger:  'bg-red-500/10 text-red-400 border border-red-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
