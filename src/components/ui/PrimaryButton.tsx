'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  className?: string;
  size?: 'default' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

export function PrimaryButton({
  children,
  href,
  onClick,
  className,
  size = 'default',
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
}: PrimaryButtonProps) {
  const sizeClasses =
    size === 'lg'
      ? 'px-8 py-4 text-lg'
      : 'px-6 py-3 text-base';

  const baseClasses =
    'be-premium-sheen inline-flex items-center justify-center min-h-[44px] rounded-lg bg-be-yellow-500 text-be-charcoal-950 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200 hover:bg-be-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-yellow-400 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-none';

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        className={cn(baseClasses, sizeClasses, className)}
        aria-disabled={disabled}
        aria-label={ariaLabel}
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
      className={cn(baseClasses, sizeClasses, className)}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
