'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Droplets,
  Grid3X3,
  Package,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  productNavGroups,
  type ProductNavSubGroup,
  type ProductNavLeaf,
} from '@/data/product-navigation';
import { ProductsMenuIllustration } from './ProductsMenuIllustration';

/* ────────────────────────────────────────────
   Category type & data
   ──────────────────────────────────────────── */

type ProductMenuCategory = 'electrical' | 'waterproofing' | 'pvc' | 'other';

interface CategoryConfig {
  id: ProductMenuCategory;
  number: string;
  label: string;
  fullName: string;
  icon: LucideIcon;
  groupId: string;
  href: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'electrical',
    number: '01',
    label: 'Electrical Mats',
    fullName: 'Electrical Insulating Mats',
    icon: ShieldCheck,
    groupId: 'electrical-insulating-mats',
    href: '/products/electrical-insulating-mats',
  },
  {
    id: 'waterproofing',
    number: '02',
    label: 'Waterproofing',
    fullName: 'Waterproofing Solutions',
    icon: Droplets,
    groupId: 'water-proofing-solutions',
    href: '/products/waterproofing-solutions',
  },
  {
    id: 'pvc',
    number: '03',
    label: 'PVC Flooring',
    fullName: 'PVC Flooring Solutions',
    icon: Grid3X3,
    groupId: 'pvc-flooring-solutions',
    href: '/products/pvc-flooring-solutions',
  },
  {
    id: 'other',
    number: '04',
    label: 'Other Products',
    fullName: 'Other Products',
    icon: Package,
    groupId: 'other-products',
    href: '/products/other-products',
  },
];

/* ────────────────────────────────────────────
   Animation & timing constants
   ──────────────────────────────────────────── */

const UNDERLINE_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const UNDERLINE_DURATION = 200; // ms
const CONTENT_TRANSITION_DURATION = 160; // ms
const HOVER_INTENT_DELAY = 80; // ms

/* ────────────────────────────────────────────
   Props
   ──────────────────────────────────────────── */

interface ProductsMegaMenuProps {
  onClose: () => void;
}

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */

export function ProductsMegaMenu({ onClose }: ProductsMegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<ProductMenuCategory>('electrical');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<ProductMenuCategory | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Product data from central navigation
  const electricalGroup = productNavGroups[0];
  const waterGroup = productNavGroups[1];
  const pvcGroup = productNavGroups[2];
  const otherGroup = productNavGroups[3];

  const domesticSub = (electricalGroup.children as ProductNavSubGroup[])[0];
  const internationalSub = (electricalGroup.children as ProductNavSubGroup[])[1];

  // Category switch with content transition
  const switchCategory = useCallback((category: ProductMenuCategory) => {
    if (category === activeCategory) return;
    setIsTransitioning(true);
    // Small delay for exit animation before swapping content
    setTimeout(() => {
      setActiveCategory(category);
      setIsTransitioning(false);
    }, CONTENT_TRANSITION_DURATION);
  }, [activeCategory]);

  // Hover intent with delay to prevent flicker
  const handleCategoryHover = useCallback((category: ProductMenuCategory) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      switchCategory(category);
    }, HOVER_INTENT_DELAY);
    setHoveredCategory(category);
  }, [switchCategory]);

  const handleCategoryHoverLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredCategory(null);
  }, []);

  const handleCategoryClick = useCallback((category: ProductMenuCategory) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // Click on a category tab navigates to the family hub page.
    // Panel switching is handled by hover (handleCategoryHover) and
    // arrow-key navigation (handleTabKeyDown), so the user can still
    // preview children before deciding to open the full category page.
    const config = CATEGORIES.find((c) => c.id === category);
    if (config?.href) {
      onClose();
      router.push(config.href);
    }
  }, [onClose, router]);

  // Keyboard navigation for tablist
  const handleTabKeyDown = useCallback((e: React.KeyboardEvent, category: ProductMenuCategory) => {
    const currentIndex = CATEGORIES.findIndex((c) => c.id === category);
    let nextIndex: number | null = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % CATEGORIES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = CATEGORIES.length - 1;
    }

    if (nextIndex !== null) {
      const nextCat = CATEGORIES[nextIndex];
      switchCategory(nextCat.id);
      tabRefs.current[nextIndex]?.focus();
    }
  }, [switchCategory]);

  // Cleanup hover timeout
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Get active category config
  const activeConfig = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-[780px] xl:w-[780px] max-w-[calc(100vw-32px)] bg-be-white border border-be-grey-250/80 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.09),0_2px_6px_rgba(0,0,0,0.05)] overflow-hidden animate-mega-menu-in"
      role="menu"
      aria-label="Product categories"
    >
      <div className="px-5 pt-3 pb-2">
        {/* ── Section eyebrow ── */}
        <p className="text-[10px] font-bold text-be-yellow-600 uppercase tracking-[0.14em] mb-2.5">
          PRODUCTS
        </p>

        {/* ── Category selector row (tablist) ── */}
        <div
          role="tablist"
          aria-label="Product categories"
          className="flex items-center gap-0 mb-0 relative"
        >
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const isHovered = hoveredCategory === cat.id;

            return (
              <button
                key={cat.id}
                ref={(el) => { tabRefs.current[index] = el; }}
                type="button"
                role="tab"
                id={`products-tab-${cat.id}`}
                aria-selected={isActive}
                aria-controls={`products-panel-${cat.id}`}
                tabIndex={isActive ? 0 : -1}
                className={cn(
                  'group relative flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] tracking-[0.02em] rounded-lg transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-brand-yellow focus-visible:ring-offset-1 focus-visible:ring-offset-be-white',
                  isActive
                    ? 'font-bold text-be-charcoal-950 bg-be-yellow-50/60'
                    : 'font-medium text-be-grey-500 hover:text-be-charcoal-800 hover:bg-be-grey-100/30',
                )}
                onClick={() => handleCategoryClick(cat.id)}
                onMouseEnter={() => handleCategoryHover(cat.id)}
                onMouseLeave={handleCategoryHoverLeave}
                onKeyDown={(e) => handleTabKeyDown(e, cat.id)}
              >
                <Icon
                  className={cn(
                    'size-[17px] transition-all duration-150',
                    isActive
                      ? 'text-be-brand-yellow'
                      : isHovered
                        ? 'text-be-grey-400 -translate-y-[0.5px]'
                        : 'text-be-grey-400 opacity-60',
                  )}
                  aria-hidden="true"
                />
                <span className={cn(
                  'text-[10px] font-bold mr-0.5',
                  isActive ? 'text-be-brand-yellow' : 'text-be-yellow-600/70',
                )}>
                  {cat.number}
                </span>
                <span>{cat.label}</span>
                {/* Active underline indicator — rendered per-tab for keyboard focus clarity */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-be-brand-yellow rounded-full"
                    style={{
                      transition: `all ${UNDERLINE_DURATION}ms ${UNDERLINE_EASING}`,
                    }}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}

          {/* ── Sliding underline indicator ── */}
          {/* This spans the full tab row and animates horizontally */}
          <span
            className="absolute bottom-0 h-[2px] bg-be-brand-yellow rounded-full pointer-events-none"
            style={{
              left: `calc(${getUnderlineLeft(activeCategory)}px)`,
              width: `${getUnderlineWidth(activeCategory)}px`,
              transition: `left ${UNDERLINE_DURATION}ms ${UNDERLINE_EASING}, width ${UNDERLINE_DURATION}ms ${UNDERLINE_EASING}`,
            }}
            aria-hidden="true"
          />
        </div>

        {/* ── Thin divider ── */}
        <div className="h-px bg-be-grey-200/60 mt-1 mb-3" />

        {/* ── Active category content panel ── */}
        <div
          ref={panelRef}
          className={cn(
            'min-h-[140px] relative',
            isTransitioning
              ? 'opacity-0 translate-y-[4px]'
              : 'opacity-100 translate-y-0',
          )}
          style={{
            transition: `opacity ${CONTENT_TRANSITION_DURATION}ms ease-out, transform ${CONTENT_TRANSITION_DURATION}ms ease-out`,
          }}
        >
          {/* Only render the active panel for performance */}
          {activeCategory === 'electrical' && (
            <div
              role="tabpanel"
              id="products-panel-electrical"
              aria-labelledby="products-tab-electrical"
              className="flex gap-7"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-be-charcoal-950 mb-2.5 flex items-center gap-2">
                  <span className="w-[2px] h-4 bg-be-brand-yellow rounded-full shrink-0" aria-hidden="true" />
                  <Link href="/products/electrical-insulating-mats" onClick={onClose} className="hover:text-be-yellow-text-hover transition-colors">
                    Electrical Insulating Mats
                  </Link>
                </p>
                <div className="grid grid-cols-2 gap-x-7">
                  {/* Domestic Mats */}
                  <div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <p className="text-[12px] font-semibold text-be-charcoal-900">Domestic</p>
                      <span className="text-[9px] font-semibold text-be-yellow-700 bg-be-yellow-50 px-1 py-[0.5px] rounded">
                        IS 15652:2006
                      </span>
                    </div>
                    <div className="flex flex-col gap-[3px]">
                      {domesticSub.items.map((item) => (
                        <ProductLink key={item.href} item={item} onClose={onClose} />
                      ))}
                    </div>
                  </div>

                  {/* International / Global */}
                  <div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <p className="text-[12px] font-semibold text-be-charcoal-900">International</p>
                      <span className="text-[9px] font-semibold text-be-yellow-700 bg-be-yellow-50 px-1 py-[0.5px] rounded">
                        IEC 61111:2009
                      </span>
                    </div>
                    <div className="flex flex-col gap-[3px]">
                      {internationalSub.items.map((item) => (
                        <ProductLink key={item.href} item={item} onClose={onClose} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Abstract illustration */}
              <div className="flex items-center justify-center w-[120px] shrink-0" aria-hidden="true">
                <ProductsMenuIllustration
                  variant="electrical"
                  className="opacity-[0.12]"
                />
              </div>
            </div>
          )}

          {activeCategory === 'waterproofing' && (
            <div
              role="tabpanel"
              id="products-panel-waterproofing"
              aria-labelledby="products-tab-waterproofing"
              className="flex gap-7"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-be-charcoal-950 mb-2.5 flex items-center gap-2">
                  <span className="w-[2px] h-4 bg-be-brand-yellow rounded-full shrink-0" aria-hidden="true" />
                  <Link href="/products/waterproofing-solutions" onClick={onClose} className="hover:text-be-yellow-text-hover transition-colors">
                    Waterproofing Solutions
                  </Link>
                </p>
                <div className="flex flex-col gap-[3px]">
                  {(waterGroup.children as ProductNavSubGroup[]).flatMap((sub) =>
                    sub.items.map((item) => (
                      <ProductLink key={item.href} item={item} onClose={onClose} />
                    ))
                  )}
                </div>
              </div>

              {/* Abstract illustration */}
              <div className="flex items-center justify-center w-[120px] shrink-0" aria-hidden="true">
                <ProductsMenuIllustration
                  variant="waterproofing"
                  className="opacity-[0.12]"
                />
              </div>
            </div>
          )}

          {activeCategory === 'pvc' && (
            <div
              role="tabpanel"
              id="products-panel-pvc"
              aria-labelledby="products-tab-pvc"
              className="flex gap-7"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-be-charcoal-950 mb-2.5 flex items-center gap-2">
                  <span className="w-[2px] h-4 bg-be-brand-yellow rounded-full shrink-0" aria-hidden="true" />
                  <Link href="/products/pvc-flooring-solutions" onClick={onClose} className="hover:text-be-yellow-text-hover transition-colors">
                    PVC Flooring Solutions
                  </Link>
                </p>
                <div className="flex flex-col gap-[3px]">
                  {(pvcGroup.children as ProductNavLeaf[]).map((item) => (
                    <ProductLink key={item.href} item={item} onClose={onClose} />
                  ))}
                </div>
              </div>

              {/* Larger illustration for single-product category */}
              <div className="flex items-center justify-center w-[140px] shrink-0" aria-hidden="true">
                <ProductsMenuIllustration
                  variant="flooring"
                  className="opacity-[0.14] w-[130px] h-auto"
                />
              </div>
            </div>
          )}

          {activeCategory === 'other' && (
            <div
              role="tabpanel"
              id="products-panel-other"
              aria-labelledby="products-tab-other"
              className="flex gap-7"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-be-charcoal-950 mb-2.5 flex items-center gap-2">
                  <span className="w-[2px] h-4 bg-be-brand-yellow rounded-full shrink-0" aria-hidden="true" />
                  <Link href="/products/other-products" onClick={onClose} className="hover:text-be-yellow-text-hover transition-colors">
                    Other Products
                  </Link>
                </p>
                <div className="flex flex-col gap-[3px]">
                  {(otherGroup.children as ProductNavLeaf[]).map((item) => (
                    <ProductLink key={item.href} item={item} onClose={onClose} />
                  ))}
                </div>
              </div>

              {/* Abstract illustration */}
              <div className="flex items-center justify-center w-[120px] shrink-0" aria-hidden="true">
                <ProductsMenuIllustration
                  variant="industrial"
                  className="opacity-[0.12]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom utility row ── */}
      <div className="h-px bg-be-grey-200/80 mx-5" />
      <div className="flex items-center justify-between px-5 py-2">
        <Link
          href="/contact-us?type=technical-guidance"
          role="menuitem"
          className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-be-charcoal-800 hover:text-be-yellow-text-hover transition-colors group/tech"
          onClick={onClose}
        >
          Technical Guidance
          <ArrowRight className="size-3 transition-transform duration-150 group-hover/tech:translate-x-[3px]" aria-hidden="true" />
        </Link>
        <Link
          href="/products"
          role="menuitem"
          className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-be-charcoal-800 hover:text-be-yellow-text-hover transition-colors group/all"
          onClick={onClose}
        >
          View All Products
          <ArrowRight className="size-3 transition-transform duration-150 group-hover/all:translate-x-[3px]" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Product link sub-component
   ──────────────────────────────────────────── */

function ProductLink({
  item,
  onClose,
}: {
  item: ProductNavLeaf;
  onClose: () => void;
}) {
  return (
    <Link
      href={item.href}
      role="menuitem"
      className="group/prod inline-flex items-center gap-1 text-[13px] leading-[20px] font-medium text-be-charcoal-800 hover:text-be-charcoal-950 px-1 py-[2px] rounded transition-colors"
      onClick={onClose}
    >
      {item.name}
      <ArrowRight
        className="size-2.5 text-be-yellow-600 opacity-0 -translate-x-1 transition-all duration-150 group-hover/prod:opacity-100 group-hover/prod:translate-x-0"
        aria-hidden="true"
      />
    </Link>
  );
}

/* ────────────────────────────────────────────
   Underline position helpers
   ──────────────────────────────────────────── */
/* These compute approximate left/width for the sliding
   underline indicator based on the active tab index.
   The values are calibrated to match the flex layout
   with px-3 padding per tab button. */

function getUnderlineLeft(category: ProductMenuCategory): number {
  const widths: Record<ProductMenuCategory, number> = {
    electrical: 12,
    waterproofing: 142,
    pvc: 300,
    other: 425,
  };
  return widths[category];
}

function getUnderlineWidth(category: ProductMenuCategory): number {
  const widths: Record<ProductMenuCategory, number> = {
    electrical: 110,
    waterproofing: 140,
    pvc: 105,
    other: 120,
  };
  return widths[category];
}
