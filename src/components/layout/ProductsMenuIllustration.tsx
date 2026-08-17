/**
 * ProductsMenuIllustration — abstract line-art illustrations for the
 * compact product mega-menu. Shared SVG system with four variants:
 *   electrical, waterproofing, flooring, industrial
 *
 * Style: thin navy strokes, tiny gold accent nodes, no fill,
 * opacity 10–15%, rounded line caps, engineering/blueprint feel.
 */
'use client';

import type { SVGAttributes } from 'react';

type IllustrationVariant = 'electrical' | 'waterproofing' | 'flooring' | 'industrial';

interface ProductsMenuIllustrationProps extends SVGAttributes<SVGSVGElement> {
  variant: IllustrationVariant;
}

/** Shared base props for all illustrations */
const baseStyle = {
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const NAVY = '#002456';
const GOLD = '#F4C313';

export function ProductsMenuIllustration({
  variant,
  ...svgProps
}: ProductsMenuIllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 90"
      width="120"
      height="90"
      aria-hidden="true"
      {...svgProps}
    >
      {variant === 'electrical' && <ElectricalIllustration />}
      {variant === 'waterproofing' && <WaterproofingIllustration />}
      {variant === 'flooring' && <FlooringIllustration />}
      {variant === 'industrial' && <IndustrialIllustration />}
    </svg>
  );
}

/** Electrical — circuit path with 2–3 nodes and a lightning/safety motif */
function ElectricalIllustration() {
  return (
    <g {...baseStyle}>
      {/* Main circuit path */}
      <path
        d="M20 45 L40 45 L50 30 L60 55 L70 35 L80 45 L100 45"
        stroke={NAVY}
        strokeWidth="1.2"
      />
      {/* Node dots */}
      <circle cx="20" cy="45" r="2.5" fill={GOLD} opacity="0.7" />
      <circle cx="50" cy="30" r="2" fill={GOLD} opacity="0.7" />
      <circle cx="70" cy="35" r="2" fill={GOLD} opacity="0.7" />
      <circle cx="100" cy="45" r="2.5" fill={GOLD} opacity="0.7" />
      {/* Safety shield motif */}
      <path
        d="M55 58 L55 72 Q55 80 63 82 Q71 80 71 72 L71 58 Z"
        stroke={NAVY}
        strokeWidth="1"
      />
      <path
        d="M59 68 L63 72 L67 64"
        stroke={GOLD}
        strokeWidth="1.2"
        fill="none"
      />
      {/* Horizontal connector lines */}
      <line x1="35" y1="45" x2="35" y2="58" stroke={NAVY} strokeWidth="0.8" strokeDasharray="2 2" />
      <line x1="85" y1="45" x2="85" y2="58" stroke={NAVY} strokeWidth="0.8" strokeDasharray="2 2" />
    </g>
  );
}

/** Waterproofing — membrane curve, water droplet, wave line, tunnel arc */
function WaterproofingIllustration() {
  return (
    <g {...baseStyle}>
      {/* Tunnel arc */}
      <path
        d="M20 75 Q20 40 60 35 Q100 40 100 75"
        stroke={NAVY}
        strokeWidth="1.2"
      />
      {/* Membrane curve */}
      <path
        d="M25 60 Q45 50 65 55 Q85 60 95 52"
        stroke={NAVY}
        strokeWidth="1"
      />
      {/* Wave line */}
      <path
        d="M15 70 Q25 65 35 70 Q45 75 55 70 Q65 65 75 70 Q85 75 95 70"
        stroke={NAVY}
        strokeWidth="0.8"
      />
      {/* Water droplet */}
      <path
        d="M75 20 Q75 10 80 15 Q85 20 75 30 Q65 20 70 15 Q75 10 75 20 Z"
        stroke={GOLD}
        strokeWidth="1"
        fill={GOLD}
        fillOpacity="0.15"
      />
      {/* Node dots on tunnel base */}
      <circle cx="20" cy="75" r="2" fill={GOLD} opacity="0.7" />
      <circle cx="100" cy="75" r="2" fill={GOLD} opacity="0.7" />
    </g>
  );
}

/** Flooring — abstract floor grid with perspective lines */
function FlooringIllustration() {
  return (
    <g {...baseStyle}>
      {/* Perspective converging lines */}
      <line x1="60" y1="20" x2="10" y2="80" stroke={NAVY} strokeWidth="0.8" />
      <line x1="60" y1="20" x2="40" y2="80" stroke={NAVY} strokeWidth="0.8" />
      <line x1="60" y1="20" x2="70" y2="80" stroke={NAVY} strokeWidth="0.8" />
      <line x1="60" y1="20" x2="110" y2="80" stroke={NAVY} strokeWidth="0.8" />
      {/* Horizontal grid lines (floor planks) */}
      <line x1="15" y1="50" x2="105" y2="50" stroke={NAVY} strokeWidth="0.7" />
      <line x1="8" y1="65" x2="112" y2="65" stroke={NAVY} strokeWidth="0.7" />
      <line x1="10" y1="80" x2="110" y2="80" stroke={NAVY} strokeWidth="0.7" />
      {/* Grid intersection nodes */}
      <circle cx="60" cy="20" r="2.5" fill={GOLD} opacity="0.7" />
      <circle cx="40" cy="50" r="1.5" fill={GOLD} opacity="0.5" />
      <circle cx="70" cy="50" r="1.5" fill={GOLD} opacity="0.5" />
      <circle cx="25" cy="65" r="1.5" fill={GOLD} opacity="0.5" />
      <circle cx="95" cy="65" r="1.5" fill={GOLD} opacity="0.5" />
    </g>
  );
}

/** Industrial — coil/sheet line illustration */
function IndustrialIllustration() {
  return (
    <g {...baseStyle}>
      {/* Coil / roll shape */}
      <path
        d="M30 65 Q30 30 60 30 Q90 30 90 55 Q90 70 75 70"
        stroke={NAVY}
        strokeWidth="1.2"
      />
      {/* Sheet trailing from roll */}
      <path
        d="M75 70 L105 70 L105 82 L40 82 L40 70"
        stroke={NAVY}
        strokeWidth="0.9"
      />
      {/* Inner coil lines */}
      <path
        d="M40 60 Q40 40 60 40 Q80 40 80 55"
        stroke={NAVY}
        strokeWidth="0.7"
      />
      {/* Node dots */}
      <circle cx="30" cy="65" r="2" fill={GOLD} opacity="0.7" />
      <circle cx="60" cy="30" r="2" fill={GOLD} opacity="0.7" />
      <circle cx="105" cy="70" r="2" fill={GOLD} opacity="0.7" />
      {/* Small conveyor belt dots */}
      <circle cx="55" cy="82" r="1.2" fill={NAVY} opacity="0.5" />
      <circle cx="65" cy="82" r="1.2" fill={NAVY} opacity="0.5" />
      <circle cx="75" cy="82" r="1.2" fill={NAVY} opacity="0.5" />
      <circle cx="85" cy="82" r="1.2" fill={NAVY} opacity="0.5" />
      <circle cx="95" cy="82" r="1.2" fill={NAVY} opacity="0.5" />
    </g>
  );
}
