import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureItem {
  icon?: LucideIcon;
  text: string;
}

interface FeatureListProps {
  items: FeatureItem[];
  className?: string;
}

export function FeatureList({ items, className }: FeatureListProps) {
  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {items.map((item, index) => {
        const Icon = item.icon ?? Check;
        return (
          <li key={index} className="flex items-start gap-3 text-body text-be-charcoal-800">
            <span className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-be-yellow-50">
              <Icon className="h-3.5 w-3.5 text-be-yellow-text" />
            </span>
            <span>{item.text}</span>
          </li>
        );
      })}
    </ul>
  );
}
