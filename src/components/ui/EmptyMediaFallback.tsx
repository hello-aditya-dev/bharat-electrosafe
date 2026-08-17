import { cn } from '@/lib/utils';

interface EmptyMediaFallbackProps {
  label?: string;
  slotId?: string;
  className?: string;
}

export function EmptyMediaFallback({ slotId, className }: EmptyMediaFallbackProps) {
  return (
    <div
      data-slot-id={slotId}
      className={cn(
        'relative flex flex-col items-center justify-center w-full h-full overflow-hidden',
        className
      )}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-be-cream via-be-yellow-50 to-be-cream" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(var(--be-grey-650) 1px, transparent 1px), linear-gradient(90deg, var(--be-grey-650) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Slow pulse animation on grid */}
      <div
        className="absolute inset-0 opacity-[0.04] animate-pulse-slow"
        style={{
          backgroundImage:
            'linear-gradient(45deg, var(--be-yellow-400) 0, transparent 40%, transparent 60%, var(--be-yellow-400) 100%)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Inner shadow */}
      <div className="absolute inset-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.04)]" />

      {/* No visible text. This component is a last-resort fallback for a
          failed image request, not a content slot — rendering the label or a
          slot code here would surface development scaffolding to visitors.
          `label` stays in the signature so callers keep passing meaningful
          alt text to the <Image> that normally renders instead. */}
    </div>
  );
}
