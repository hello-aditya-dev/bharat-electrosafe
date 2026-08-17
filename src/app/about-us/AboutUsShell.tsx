import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/ui/BackToTop';
import { MobileStickyCTA } from '@/components/ui/MobileStickyCTA';
import AboutIntro from '@/components/about/AboutIntro';
import ProductScope from '@/components/about/ProductScope';
import CompanyLeadership from '@/components/about/CompanyLeadership';
import BrandsVisionMission from '@/components/about/BrandsVisionMission';
import WhyBharatElectrosafe from '@/components/about/WhyBharatElectrosafe';
import AwardsCertifications from '@/components/about/AwardsCertifications';
import ClientsProjects from '@/components/about/ClientsProjects';
import AboutCTA from '@/components/about/AboutCTA';

/**
 * AboutUsShell — Server Component.
 *
 * Section structure:
 *   1. WHO WE ARE                     (AboutIntro — single coherent About section with two-image layout)
 *   2. LEADERSHIP                    (CompanyLeadership — warm-white bg, flip cards)
 *   3. BRANDS + VISION / MISSION     (BrandsVisionMission — navy band)
 *   4. WHY BHARAT ELECTROSAFE        (WhyBharatElectrosafe — cream bg)
 *   5. RECOGNITION & TRUST           (AwardsCertifications — white bg)
 *   6. CLIENTS & INDUSTRY + MEDIA    (ClientsProjects — white bg, includes video carousel)
 *   7. CTA                           (AboutCTA — yellow/navy emphasis)
 *
 * AboutIntro renders Who We Are as a single section with approved content,
 * two-column image/content layout, bold product names, and no content
 * duplication.
 */

export default function AboutUsShell() {
  return (
    <div className="min-h-screen flex flex-col bg-be-warm-white">
      <Header />
      <main className="flex-1">
        {/* 1. Who We Are — single coherent About section with two-image layout */}
        <AboutIntro />
      <ProductScope />

        {/* 2. Leadership — white bg, flip cards */}
        <CompanyLeadership />

        {/* 3. Brands + Vision / Mission — navy band (self-contained) */}
        <BrandsVisionMission />

        {/* ── Full-width section divider ── */}
        <div
          className="w-full h-px bg-be-grey-250"
          aria-hidden="true"
        />

        {/* 4. Why Bharat Electrosafe — cream bg */}
        <WhyBharatElectrosafe />

        {/* 5. Recognition & Trust — white bg */}
        <AwardsCertifications />

        {/* 6. Clients & Industry + Media — white bg (includes video carousel) */}
        <ClientsProjects />

        {/* 7. CTA — yellow/navy emphasis */}
        <AboutCTA />
      </main>
      <Footer />
      <BackToTop />
      <MobileStickyCTA />
    </div>
  );
}
