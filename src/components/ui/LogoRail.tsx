'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoItem {
  name: string;
  src?: string;
}

interface LogoRailProps {
  logos: LogoItem[];
  className?: string;
}

export function LogoRail({ logos, className }: LogoRailProps) {
  // Duplicate logos for seamless loop
  const duplicated = [...logos, ...logos];

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        className
      )}
      aria-label="Partner logos"
    >
      <div className="logo-rail-track">
        {duplicated.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="flex shrink-0 items-center justify-center w-40 h-20 px-4 grayscale hover:grayscale-0 transition-all duration-300"
          >
            {logo.src ? (
              /* Relative sized container + `fill` preserves the intrinsic
                 aspect ratio without CSS width/height overrides (which
                 previously triggered the Next.js image warning). */
              <span className="relative flex h-12 w-32 items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </span>
            ) : (
              <span className="text-sm text-be-grey-650 font-semibold text-center hover:text-be-charcoal-800 hover:underline underline-offset-4 transition-all duration-300">
                {logo.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
