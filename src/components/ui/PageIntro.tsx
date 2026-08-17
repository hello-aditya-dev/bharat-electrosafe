import { cn } from '@/lib/utils';
import { Eyebrow } from './Eyebrow';

interface PageIntroProps {
  title: string;
  description: string;
  className?: string;
  eyebrow?: string;
}

export function PageIntro({
  title,
  description,
  className,
  eyebrow,
}: PageIntroProps) {
  return (
    <div className={cn('flex flex-col gap-4 max-w-3xl', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="text-page-h1 text-be-charcoal-950">{title}</h1>
      <p className="text-body-large text-be-grey-650">{description}</p>
    </div>
  );
}
