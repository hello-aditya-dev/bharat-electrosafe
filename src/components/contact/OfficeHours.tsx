'use client';

import { Clock } from 'lucide-react';
import { company } from '@/data/company';

/**
 * Compact office-hours card.
 *
 * Rendered inline inside the office column of Chapter 2 — no longer a
 * separate full-width section. Uses a bordered card so it visually groups
 * with the address and contact rows above it.
 *
 * Returns null when `company.officeHours.verified` is false. The office
 * hours shown on the original company website have NOT been independently
 * confirmed by the client as the current operating schedule, so they must
 * not be displayed until verification. Phone, email, address, enquiry form
 * and WhatsApp options remain visible regardless.
 */
export default function OfficeHours() {
  const { verified, rows } = company.officeHours;

  if (!verified) return null;

  return (
    <div className="reveal-up rounded-lg border border-be-grey-250 bg-be-white p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-md bg-be-yellow-50 border border-be-yellow-100"
        >
          <Clock className="h-4 w-4 text-be-yellow-text" aria-hidden="true" focusable="false" />
        </span>
        <h3 className="text-card-title text-be-charcoal-950">Office Hours</h3>
      </div>

      {/* Hours list */}
      <ul className="flex flex-col divide-y divide-be-grey-150">
        {rows.map((row) => (
          <li
            key={row.day}
            className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
          >
            <span className="text-body font-medium text-be-charcoal-950">
              {row.day}
            </span>
            <span
              className={
                'closed' in row && row.closed
                  ? 'text-body text-be-grey-650 italic'
                  : 'text-body text-be-charcoal-800 tabular-nums'
              }
            >
              {row.hours}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
