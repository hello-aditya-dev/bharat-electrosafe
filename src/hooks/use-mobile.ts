import * as React from "react"

const MOBILE_BREAKPOINT = 768

/* Read through useSyncExternalStore rather than syncing into state from an
   effect: the server snapshot is false, and the client subscribes to the media
   query directly, so there is no cascading render on mount. */
function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", onStoreChange)
  return () => mql.removeEventListener("change", onStoreChange)
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.innerWidth < MOBILE_BREAKPOINT,
    () => false
  )
}
