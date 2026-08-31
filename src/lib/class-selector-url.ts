/**
 * Deep-link helpers for the interactive class selectors (domestic HV page
 * and Global IEC HV page).
 *
 * The selectors keep their state shareable: the recommended class is
 * mirrored into the page URL as `?class=Class N` via history.replaceState
 * (no navigation, no history pollution), and a selector freshly mounted on
 * a URL that already carries `?class=` initialises itself to that class.
 *
 * NOTE: this `?class=` usage on PRODUCT pages is independent of the
 * contact page's `?class=` quote-prefill — different routes, no overlap.
 */

/** Reads the current `?class=` query param (browser only). */
export function readClassParam(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return new URLSearchParams(window.location.search).get('class');
  } catch {
    return null;
  }
}

/**
 * Mirrors the selector state into the URL without navigation.
 * Pass null to remove the param. Other query params are preserved.
 */
export function syncClassParam(klass: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    if (klass) {
      url.searchParams.set('class', klass);
    } else {
      url.searchParams.delete('class');
    }
    window.history.replaceState(null, '', url);
  } catch {
    /* ignore */
  }
}

/** Normalises a class label for comparison ("class  b" → "class b"). */
export function normalizeClassLabel(label: string): string {
  return label.toLowerCase().trim().replace(/\s+/g, ' ');
}
