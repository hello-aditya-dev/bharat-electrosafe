import { cn } from '@/lib/utils';
import { Eyebrow } from './Eyebrow';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  supportingText?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  supportingText,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={cn('flex flex-col gap-3', alignment, className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className={cn(
        'text-section-h2 text-be-charcoal-950',
        align === 'left' && 'accent-line-yellow'
      )}>
        {title}
      </h2>
      {supportingText && (
        <p className={cn(
          'text-body-large text-be-grey-650',
          align === 'left' ? 'max-w-xl' : 'max-w-2xl'
        )}>
          {supportingText}
        </p>
      )}
    </div>
  );
}
