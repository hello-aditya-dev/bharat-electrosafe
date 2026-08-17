import { cn } from '@/lib/utils';

interface TechnicalBadgeProps {
  label: string;
  className?: string;
}

export function TechnicalBadge({ label, className }: TechnicalBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-be-yellow-50 text-be-charcoal-800 text-metadata font-semibold px-2.5 py-1',
        className
      )}
    >
      {label}
    </span>
  );
}
