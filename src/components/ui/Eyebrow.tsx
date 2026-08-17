import { cn } from '@/lib/utils';

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        'inline-block text-[0.75rem] uppercase tracking-widest text-be-grey-650 font-semibold border-l-2 border-be-yellow-500 pl-3',
        className
      )}
    >
      {children}
    </span>
  );
}
