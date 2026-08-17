'use client';

import { company, phones } from '@/data/company';
import { MapPin, Mail, Phone, Navigation, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import OfficeHours from '@/components/contact/OfficeHours';
import {
  officeMapsDirectionsUrl,
  officeMapPreviewSrc,
} from '@/components/contact/ContactIntro';

/**
 * Chapter 2 — Office and Location.
 *
 * Combines office address, contact links, office hours and the map into one
 * section. Office hours are rendered inline inside the left column.
 *
 * Map behaviour (privacy-conscious + 100% reliable):
 *   The map area shows the locally-stored static SVG preview (real road
 *   geometry, marker, address). The entire map area is a single clickable
 *   link that opens the exact Google Maps destination in a new tab.
 *
 *   We deliberately do NOT use an iframe. Previous attempts to embed an
 *   OpenStreetMap iframe were unreliable — ad blockers, privacy extensions
 *   (uBlock Origin, Brave Shields), corporate firewalls and Chrome's Safe
 *   Browsing all routinely block openstreetmap.org, leaving the user with
 *   Chrome's "This content is blocked" message inside the iframe area.
 *   Google Maps `output=embed` is not an alternative either — Google
 *   returns 404 + `x-frame-options: SAMEORIGIN` for that URL without an
 *   API key.
 *
 *   The no-iframe approach works everywhere: no third-party request is
 *   made until the user clicks, no CSP frame-src entry is needed, and the
 *   user lands directly on Google Maps with directions pre-filled.
 *
 * "Get Directions" in the left column opens the same Google Maps URL.
 *
 * Map height is capped at ~440px on desktop (per spec: 420-460px range)
 * to avoid a near-square aspect ratio. The office column is top-aligned.
 */
export default function OfficeLocation() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[0.4fr_0.6fr] gap-7 lg:gap-12 lg:items-start">
      {/* ───────────── Left column — office info + hours (compact) ───────────── */}
      <div className="reveal-up flex flex-col gap-4 lg:gap-5">
        <h2 className="text-section-h2 text-be-charcoal-950">
          Our Office
        </h2>

        {/* Full address (linked to exact Maps destination) */}
        <a
          href={officeMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 text-body text-be-charcoal-800 leading-relaxed hover:text-be-yellow-text-hover transition-colors min-h-[44px] py-1"
        >
          <MapPin className="size-5 text-be-yellow-text shrink-0 mt-1" aria-hidden="true" focusable="false" />
          <div>
            <p className="font-semibold text-be-charcoal-950">{company.name}</p>
            <p>{company.address.line1}</p>
            <p>{company.address.line2}</p>
            <p>{company.address.city}, {company.address.state} — {company.address.pincode}</p>
            <p>{company.address.country}</p>
          </div>
        </a>

        {/* Quick contact rows */}
        <div className="flex flex-col">
          <a
            href={`mailto:${company.email}`}
            className="flex items-center gap-2 text-body text-be-charcoal-800 hover:text-be-yellow-text-hover transition-colors py-2 min-h-[44px] border-t border-be-grey-150"
          >
            <Mail className="size-4 text-be-yellow-text" aria-hidden="true" focusable="false" />
            {company.email}
          </a>
          {phones.map((phone) => (
            <a
              key={phone.tel}
              href={`tel:${phone.tel}`}
              className="flex items-center gap-2 text-body text-be-charcoal-800 hover:text-be-yellow-text-hover transition-colors py-2 min-h-[44px] border-t border-be-grey-150"
            >
              <Phone className="size-4 text-be-yellow-text" aria-hidden="true" focusable="false" />
              {phone.display}
            </a>
          ))}
        </div>

        {/* Office hours — inline, no longer a separate section */}
        <OfficeHours />

        {/* Response-time note */}
        <p className="text-metadata text-be-grey-650">
          Our team will review your enquiry and respond with the next steps.
        </p>

        {/* Directions CTA */}
        <div>
          <SecondaryButton href={officeMapsDirectionsUrl} target="_blank">
            <Navigation className="size-4 mr-1.5" aria-hidden="true" focusable="false" />
            Get Directions
          </SecondaryButton>
        </div>
      </div>

      {/* ───────────── Right column — clickable static map (capped at 440px) ───────────── */}
      <div className="reveal-up rounded-lg overflow-hidden border border-be-grey-250 bg-be-cream h-[280px] lg:h-[440px] flex relative">
        <a
          href={officeMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-full h-full flex items-center justify-center bg-be-cream hover:bg-be-yellow-50/40 transition-colors cursor-pointer"
          aria-label="Open Bharat Electrosafe office location in Google Maps (opens in a new tab)"
        >
          {/* Static SVG preview — real road geometry, marker, address label.
              No third-party request is made until the user clicks. */}
          <Image
            src={officeMapPreviewSrc}
            alt="Map preview showing Bharat Electrosafe office location in Sector 62, Noida. Click to open in Google Maps."
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            priority={false}
          />

          {/* Top-right corner badge — signals that the map is clickable */}
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-be-warm-white/95 backdrop-blur-sm text-be-charcoal-950 px-2.5 py-1 text-xs font-semibold shadow-sm ring-1 ring-be-grey-150">
            <ExternalLink className="size-3 text-be-yellow-text" aria-hidden="true" focusable="false" />
            Opens in Google Maps
          </span>

          {/* Bottom-centre CTA — primary affordance */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-5 pointer-events-none">
            <span className="inline-flex items-center gap-2 rounded-full bg-be-charcoal-950/90 text-be-warm-white px-5 py-2.5 text-sm font-semibold shadow-lg group-hover:bg-be-charcoal-950 group-hover:scale-[1.02] transition-all">
              <MapPin className="size-4 text-be-yellow-text" aria-hidden="true" focusable="false" />
              View on Google Maps
              <ExternalLink className="size-3.5 ml-0.5 opacity-80" aria-hidden="true" focusable="false" />
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
