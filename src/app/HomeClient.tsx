import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/ui/BackToTop';
import { MobileStickyCTA } from '@/components/ui/MobileStickyCTA';
import HomeHero from '@/components/home/HomeHero';
import StatisticsStrip from '@/components/home/StatisticsStrip';
import ProductRange from '@/components/home/ProductRange';
import CertificationsSection from '@/components/home/CertificationsSection';
import IndustryReferences from '@/components/home/IndustryReferences';
import CapabilityIndustries from '@/components/home/CapabilityIndustries';
import HomeFAQCTA from '@/components/home/HomeFAQCTA';

/**
 * HomeShell — Server Component.
 *
 * Final homepage information architecture (per final homepage production
 * pass):
 *
 *   Header → Hero → Statistics Strip → Product Range →
 *   Certifications / Testing → Capability / Industries →
 *   Industry References → FAQ → Footer
 *
 * Removed from this version:
 *   - The bundled TrustDocuments section (split into CertificationsSection
 *     and IndustryReferences).
 *   - The duplicate company-reach statistics that used to live inside
 *     TrustDocuments (the StatisticsStrip is the single source for those).
 *   - Any About Us link inside the industry references block (the About Us
 *     link is preserved inside Capability/Industries, so no navigation is
 *     lost).
 *
 * Interactive islands ship client JavaScript only where needed.
 * RevealObserver is mounted globally from the root layout so the same
 * visibility behavior applies to every route.
 */
export default function HomeShell() {
  return (
    <div className="min-h-screen flex flex-col bg-be-warm-white">
      <Header />
      <main className="flex-1">
        {/* 1. Hero + trust proof */}
        <HomeHero />
        {/* 2. Statistics strip — company credibility */}
        <StatisticsStrip />
        {/* 3. Product range — four families */}
        <ProductRange />
        {/* 4. Certifications, testing and registrations */}
        <CertificationsSection />
        {/* 5. Capability + industries (rendered once) */}
        <CapabilityIndustries />
        {/* 6. Industry references */}
        <IndustryReferences />
        {/* 7. FAQ (final content section) + CTA */}
        <HomeFAQCTA />
      </main>
      <Footer />
      <BackToTop />
      <MobileStickyCTA />
    </div>
  );
}
