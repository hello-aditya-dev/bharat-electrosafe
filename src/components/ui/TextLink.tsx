import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  showArrow?: boolean;
}

export function TextLink({
  children,
  href,
  className,
  showArrow = true,
}: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'hover-arrow-shift inline-flex items-center gap-1.5 text-be-charcoal-800 hover:text-be-yellow-text-hover transition-colors duration-200 underline-offset-4 hover:underline font-medium',
        className
      )}
    >
      <span>{children}</span>
      {showArrow && (
        <ArrowRight className="hover-arrow h-4 w-4 shrink-0" aria-hidden="true" focusable="false" />
      )}
    </Link>
  );
}
