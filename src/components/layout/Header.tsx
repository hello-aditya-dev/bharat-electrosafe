'use client';

import { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Search,
} from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import {
  productNavGroups,
  getAllProductLinks,
  type ProductNavSubGroup,
  type ProductNavLeaf,
} from '@/data/product-navigation';
import { ProductsMegaMenu } from './ProductsMegaMenu';

/* ────────────────────────────────────────────
   Hover-intent delay constants
   ──────────────────────────────────────────── */

const OPEN_DELAY = 100; // ms before opening on hover
const CLOSE_DELAY = 250; // ms grace period before closing
const ESCAPE_KEY = 'Escape';

/* ────────────────────────────────────────────
   Logo asset constants
   ────────────────────────────────────────────
   Transparent PNG — 1260×675, approved Bharat Electrosafe logo.
   Trimmed from 1536×1024 source to remove excess transparent
   padding while preserving minimal margin for crisp rendering.
   Aspect ratio matches previous header logo (≈1.87) so CSS
   sizing rules produce the same visual footprint. */

const LOGO_SRC = '/brand/bharat-electrosafe-logo-header.png';
const LOGO_WIDTH = 1260;
const LOGO_HEIGHT = 675;

/* ────────────────────────────────────────────
   Header component
   ──────────────────────────────────────────── */

export function Header() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const isProductActive = pathname.startsWith('/products');

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => { document.body.style.overflow = ''; document.body.style.paddingRight = ''; };
  }, [mobileOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Hover-intent handlers
  const clearOpenTimeout = useCallback(() => { if (openTimeoutRef.current) { clearTimeout(openTimeoutRef.current); openTimeoutRef.current = null; } }, []);
  const clearCloseTimeout = useCallback(() => { if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; } }, []);

  const handleDropdownEnter = useCallback(() => {
    clearCloseTimeout(); clearOpenTimeout();
    openTimeoutRef.current = setTimeout(() => setDropdownOpen(true), OPEN_DELAY);
  }, [clearCloseTimeout, clearOpenTimeout]);

  const handleDropdownLeave = useCallback(() => {
    clearOpenTimeout(); clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => setDropdownOpen(false), CLOSE_DELAY);
  }, [clearOpenTimeout, clearCloseTimeout]);

  // Keyboard handler for dropdown trigger
  const handleDropdownKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ESCAPE_KEY) {
      setDropdownOpen(false);
      const triggerBtn = triggerRef.current?.querySelector('[aria-haspopup]');
      if (triggerBtn instanceof HTMLElement) triggerBtn.focus();
    }
    if (e.key === 'ArrowDown' && !dropdownOpen) { e.preventDefault(); setDropdownOpen(true); }
  }, [dropdownOpen]);

  // Mega-menu keyboard navigation
  const handleMegaMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ESCAPE_KEY) {
      setDropdownOpen(false);
      const triggerBtn = triggerRef.current?.querySelector('[aria-haspopup]');
      if (triggerBtn instanceof HTMLElement) triggerBtn.focus();
    }
    if (e.key === 'Tab' && megaMenuRef.current) {
      const focusable = megaMenuRef.current.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, []);

  // Close dropdown on route change
  useEffect(() => { startTransition(() => setDropdownOpen(false)); }, [pathname]);

  // Cleanup timeouts on unmount
  useEffect(() => { return () => { clearOpenTimeout(); clearCloseTimeout(); }; }, [clearOpenTimeout, clearCloseTimeout]);

  // Destructure product groups for mobile layout
  const electricalGroup = productNavGroups[0]; // Electrical Insulating Mats
  const waterGroup = productNavGroups[1];       // Water Proofing Solutions
  const pvcGroup = productNavGroups[2];          // PVC Flooring Solutions
  const otherGroup = productNavGroups[3];        // Other Products

  const domesticSub = (electricalGroup.children as ProductNavSubGroup[])[0];
  const internationalSub = (electricalGroup.children as ProductNavSubGroup[])[1];

  // Helper: flatten items for a group without sub-groups rendering
  const getGroupItems = (group: typeof productNavGroups[number]): ProductNavLeaf[] => {
    if (group.hasSubGroups) {
      return (group.children as ProductNavSubGroup[]).flatMap((s) => s.items);
    }
    return group.children as ProductNavLeaf[];
  };

  // All product links for search dialog
  const allProductLinks = getAllProductLinks();

  return (
    <header className="contents z-50">
      {/* ── Main-Header Bar ── */}
      <div
        className="sticky top-0 z-50 be-header-navy h-16 lg:h-20"
      >
        {/* 3-column grid: Logo | Nav | CTA */}
        <div className="container-site page-horizontal-padding grid grid-cols-[minmax(0,1fr)_auto] items-center h-full gap-2 lg:grid-cols-[minmax(180px,1fr)_auto_minmax(180px,1fr)] lg:gap-4">
          {/* ── Column 1: Logo ── */}
          <div className="flex items-center justify-start min-w-0">
            <Link
              href="/"
              className="shrink-0 flex items-center py-1 lg:py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-be-navy-800"
              aria-label="Bharat Electrosafe — Home"
            >
              <Image
                src={LOGO_SRC}
                alt="Bharat Electrosafe® logo"
                width={LOGO_WIDTH}
                height={LOGO_HEIGHT}
                sizes="(max-width: 1023px) 97px, 125px"
                className="object-contain h-[53px] lg:h-[68px] w-auto"
                priority
              />
            </Link>
          </div>

          {/* ── Column 2: Desktop Navigation ── */}
          <nav className="hidden lg:flex items-center justify-center gap-1" aria-label="Main navigation">
            <Link
              href="/"
              className={cn(
                'px-3 py-2 text-sm font-medium transition-colors',
                pathname === '/'
                  ? 'text-be-brand-yellow'
                  : 'text-white/80 hover:text-white'
              )}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>

            <Link
              href="/about-us"
              className={cn(
                'px-3 py-2 text-sm font-medium transition-colors',
                pathname === '/about-us' ? 'text-be-brand-yellow' : 'text-white/80 hover:text-white'
              )}
              aria-current={pathname === '/about-us' ? 'page' : undefined}
            >
              About Us
            </Link>

            {/* Products: hover opens mega-menu */}
            <div
              ref={triggerRef}
              className="flex items-center relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
              onKeyDown={handleDropdownKeyDown}
            >
              <Link
                href="/products"
                className={cn(
                  'px-2 py-2 text-sm font-medium transition-colors',
                  isProductActive && !dropdownOpen ? 'text-be-brand-yellow' : 'text-white/80 hover:text-white'
                )}
                aria-current={isProductActive ? 'page' : undefined}
              >
                Products
              </Link>
              <button
                type="button"
                className={cn(
                  'px-1.5 py-2 text-sm font-medium transition-colors',
                  dropdownOpen
                    ? 'text-be-brand-yellow'
                    : isProductActive
                      ? 'text-be-brand-yellow'
                      : 'text-white/80 hover:text-white'
                )}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-controls="products-mega-menu"
                aria-label={dropdownOpen ? 'Close products menu' : 'Open products menu'}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <ChevronDown
                  className={cn('size-3.5 transition-transform duration-200', dropdownOpen && 'rotate-180')}
                  aria-hidden="true"
                  focusable="false"
                />
              </button>
              {/* Subtle active indicator bar */}
              {(dropdownOpen || isProductActive) && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-be-brand-yellow rounded-full" aria-hidden="true" />
              )}
            </div>

            <Link
              href="/contact-us"
              className={cn(
                'px-3 py-2 text-sm font-medium transition-colors',
                pathname === '/contact-us' ? 'text-be-brand-yellow' : 'text-white/80 hover:text-white'
              )}
              aria-current={pathname === '/contact-us' ? 'page' : undefined}
            >
              Contact Us
            </Link>

            {/* Search / Quick-find button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center justify-center size-8 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-be-navy-800"
              aria-label="Search products"
            >
              <Search className="size-4" aria-hidden="true" />
            </button>
          </nav>

          {/* ── Column 3: CTA + Mobile menu ── */}
          <div className="flex items-center justify-end gap-2 shrink-0 lg:shrink">
            <PrimaryButton
              href="/contact-us"
              className="hidden lg:inline-flex text-sm px-4 py-2 shadow-sm hover:shadow-sm hover:translate-y-0 min-h-[40px]"
            >
              Request a Quote
            </PrimaryButton>

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="lg:hidden inline-flex items-center justify-center size-11 rounded-md text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-be-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-be-navy-800"
                  aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-navigation-sheet"
                >
                  <Menu className="size-6" aria-hidden="true" focusable="false" />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[320px] sm:w-[360px] bg-be-navy-900 p-0 border-l border-white/10 [&>button]:text-white [&>button]:opacity-100 [&>button]:size-11 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:hover:text-be-brand-yellow [&>button]:hover:bg-white/10 [&>button]:focus-visible:ring-be-brand-yellow [&>button>svg]:size-5" id="mobile-navigation-sheet">
                <SheetHeader className="px-5 pt-5 pb-3 border-b border-white/10">
                  <SheetTitle className="flex items-center">
                    <Link href="/" onClick={() => setMobileOpen(false)}>
                      <Image
                        src={LOGO_SRC}
                        alt="Bharat Electrosafe® logo"
                        width={LOGO_WIDTH}
                        height={LOGO_HEIGHT}
                        sizes="160px"
                        className="object-contain w-[160px] h-auto"
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col py-2 overflow-y-auto" aria-label="Mobile navigation">
                  <Link href="/"
                    className={cn('px-5 py-3.5 text-base font-medium transition-colors min-h-[44px] flex items-center', pathname === '/' ? 'text-be-brand-yellow bg-white/8 border-l-[3px] border-be-brand-yellow' : 'text-white/90 hover:bg-white/6 hover:text-be-brand-yellow')}
                    onClick={() => setMobileOpen(false)} aria-current={pathname === '/' ? 'page' : undefined}
                  >Home</Link>

                  <Link href="/about-us"
                    className={cn('px-5 py-3.5 text-base font-medium transition-colors min-h-[44px] flex items-center', pathname === '/about-us' ? 'text-be-brand-yellow bg-white/8 border-l-[3px] border-be-brand-yellow' : 'text-white/90 hover:bg-white/6 hover:text-be-brand-yellow')}
                    onClick={() => setMobileOpen(false)} aria-current={pathname === '/about-us' ? 'page' : undefined}
                  >About Us</Link>

                  {/* Products accordion */}
                  <Accordion type="single" collapsible className="px-0">
                    <AccordionItem value="products" className="border-b-0">
                      <AccordionTrigger className={cn('px-5 py-3.5 text-base font-medium transition-colors min-h-[44px] hover:no-underline', isProductActive ? 'text-be-brand-yellow bg-white/8 border-l-[3px] border-be-brand-yellow' : 'text-white/90 hover:bg-white/6 hover:text-be-brand-yellow')}>
                        Products
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        <div className="flex flex-col">
                          {/* Electrical Insulating Mats */}
                          <div className="pl-4">
                            <div className="px-3 py-2 text-[0.75rem] font-semibold text-be-brand-yellow uppercase tracking-wider">
                              Electrical Insulating Mats
                            </div>
                            {/* Domestic Mats */}
                            <div className="pl-3">
                              <div className="flex items-baseline gap-1 px-2 py-1">
                                <span className="text-[0.7rem] font-medium text-white/50 uppercase tracking-wider">Domestic Mats</span>
                                {domesticSub.standard && (
                                  <span className="text-[0.55rem] font-semibold text-be-brand-yellow/70">{domesticSub.standard}</span>
                                )}
                              </div>
                              {domesticSub.items.map((item) => (
                                <Link key={item.href} href={item.href}
                                  className="flex items-center px-2 py-2.5 text-sm text-white/85 hover:text-be-brand-yellow hover:bg-white/6 transition-colors min-h-[44px]"
                                  onClick={() => setMobileOpen(false)}
                                >{item.name}</Link>
                              ))}
                            </div>
                            {/* International / Global */}
                            <div className="pl-3 mt-1">
                              <div className="flex items-baseline gap-1 px-2 py-1">
                                <span className="text-[0.7rem] font-medium text-white/50 uppercase tracking-wider">International / Global</span>
                                {internationalSub.standard && (
                                  <span className="text-[0.55rem] font-semibold text-be-brand-yellow/70">{internationalSub.standard}</span>
                                )}
                              </div>
                              {internationalSub.items.map((item) => (
                                <Link key={item.href} href={item.href}
                                  className="flex items-center px-2 py-2.5 text-sm text-white/85 hover:text-be-brand-yellow hover:bg-white/6 transition-colors min-h-[44px]"
                                  onClick={() => setMobileOpen(false)}
                                >{item.name}</Link>
                              ))}
                            </div>
                          </div>

                          {/* Water Proofing Solutions */}
                          <div className="pl-4 mt-2">
                            <div className="px-3 py-2 text-[0.75rem] font-semibold text-be-brand-yellow uppercase tracking-wider">
                              Water Proofing Solutions
                            </div>
                            <div className="pl-3">
                              {getGroupItems(waterGroup).map((item) => (
                                <Link key={item.href} href={item.href}
                                  className="flex items-center px-2 py-2.5 text-sm text-white/85 hover:text-be-brand-yellow hover:bg-white/6 transition-colors min-h-[44px]"
                                  onClick={() => setMobileOpen(false)}
                                >{item.name}</Link>
                              ))}
                            </div>
                          </div>

                          {/* PVC Flooring Solutions */}
                          <div className="pl-4 mt-2">
                            <div className="px-3 py-2 text-[0.75rem] font-semibold text-be-brand-yellow uppercase tracking-wider">
                              PVC Flooring Solutions
                            </div>
                            <div className="pl-3">
                              {getGroupItems(pvcGroup).map((item) => (
                                <Link key={item.href} href={item.href}
                                  className="flex items-center px-2 py-2.5 text-sm text-white/85 hover:text-be-brand-yellow hover:bg-white/6 transition-colors min-h-[44px]"
                                  onClick={() => setMobileOpen(false)}
                                >{item.name}</Link>
                              ))}
                            </div>
                          </div>

                          {/* Other Products */}
                          <div className="pl-4 mt-2">
                            <div className="px-3 py-2 text-[0.75rem] font-semibold text-be-brand-yellow uppercase tracking-wider">
                              Other Products
                            </div>
                            <div className="pl-3">
                              {getGroupItems(otherGroup).map((item) => (
                                <Link key={item.href} href={item.href}
                                  className="flex items-center px-2 py-2.5 text-sm text-white/85 hover:text-be-brand-yellow hover:bg-white/6 transition-colors min-h-[44px]"
                                  onClick={() => setMobileOpen(false)}
                                >{item.name}</Link>
                              ))}
                            </div>
                          </div>

                          {/* View All + Technical Guidance */}
                          <div className="mt-2 mx-5 border-t border-white/10 pt-3 space-y-1">
                            <Link href="/products"
                              className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-be-brand-yellow hover:bg-white/6 rounded-md transition-colors min-h-[44px]"
                              onClick={() => setMobileOpen(false)}
                            >
                              View All Products
                              <ChevronRight className="size-3.5" aria-hidden="true" />
                            </Link>
                            <Link href="/contact-us?type=technical-guidance"
                              className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-white/80 hover:text-be-brand-yellow hover:bg-white/6 rounded-md transition-colors min-h-[44px]"
                              onClick={() => setMobileOpen(false)}
                            >
                              Technical Guidance
                              <ChevronRight className="size-3.5" aria-hidden="true" />
                            </Link>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mx-5 my-1 h-px bg-white/10" />

                  <Link href="/contact-us"
                    className={cn('px-5 py-3.5 text-base font-medium transition-colors min-h-[44px] flex items-center', pathname === '/contact-us' ? 'text-be-brand-yellow bg-white/8 border-l-[3px] border-be-brand-yellow' : 'text-white/90 hover:bg-white/6 hover:text-be-brand-yellow')}
                    onClick={() => setMobileOpen(false)} aria-current={pathname === '/contact-us' ? 'page' : undefined}
                  >Contact Us</Link>
                </nav>

                {/* CTA at bottom of mobile sheet */}
                <div className="mt-auto px-5 pb-6 pt-4 border-t border-white/10">
                  <PrimaryButton href="/contact-us" className="w-full justify-center" onClick={() => setMobileOpen(false)}>
                    Request a Quote
                  </PrimaryButton>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* ── Products Mega-Menu ──
            Compact category-switcher: only one category expanded at a time.
            Uses tablist/tab/tabpanel ARIA semantics. */}
        {dropdownOpen && (
          <div
            ref={megaMenuRef}
            id="products-mega-menu"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
            onKeyDown={handleMegaMenuKeyDown}
          >
            <ProductsMegaMenu onClose={() => setDropdownOpen(false)} />
          </div>
        )}
        <ScrollProgress />
      </div>

      {/* ── Product Search Command Dialog ── */}
      <CommandDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title="Search Products"
        description="Find a product by name"
      >
        <CommandInput placeholder="Search products..." />
        <CommandList>
          <CommandEmpty>No products found.</CommandEmpty>
          {productNavGroups.map((group) => (
            <CommandGroup key={group.id} heading={group.name}>
              {group.hasSubGroups
                ? (group.children as ProductNavSubGroup[]).flatMap((sub) =>
                    sub.items.map((item) => (
                      <CommandItem
                        key={item.href}
                        value={`${item.name} ${group.name} ${sub.name}`}
                        onSelect={() => {
                          setSearchOpen(false);
                          window.location.href = item.href;
                        }}
                      >
                        <span className="truncate">{item.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground truncate">
                          {sub.name}
                        </span>
                      </CommandItem>
                    ))
                  )
                : (group.children as ProductNavLeaf[]).map((item) => (
                    <CommandItem
                      key={item.href}
                      value={`${item.name} ${group.name}`}
                      onSelect={() => {
                        setSearchOpen(false);
                        window.location.href = item.href;
                      }}
                    >
                      <span className="truncate">{item.name}</span>
                    </CommandItem>
                  ))
              }
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </header>
  );
}
