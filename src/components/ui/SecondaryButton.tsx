'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SecondaryButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  target?: string;
}

export function SecondaryButton({
  children,
  href,
  onClick,
  className,
  disabled = false,
  type = 'button',
  target,
}: SecondaryButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center min-h-[44px] rounded-lg border border-be-grey-250 text-be-charcoal-800 font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-be-yellow-400 hover:text-be-charcoal-950 active:translate-y-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2 px-6 py-3 text-base bg-transparent disabled:opacity-60 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-none';

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        className={cn(baseClasses, className)}
        aria-disabled={disabled}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
      className={cn(baseClasses, className)}
    >
      {children}
    </button>
  );
}
