'use client'

import { createContext, useContext } from 'react'

/**
 * Provides a custom container element for Radix UI portals.
 *
 * When the app enters fullscreen via the Fullscreen API, only the fullscreen
 * element and its descendants are visible. Radix portals default to
 * `document.body`, which falls outside the fullscreen stacking context.
 * This context lets us redirect portals into the fullscreen element instead.
 *
 * When the value is `null` (default / not fullscreen), Radix uses its
 * own default (`document.body`).
 */
const PortalContainerContext = createContext<HTMLElement | null>(null)

export const PortalContainerProvider = PortalContainerContext.Provider

/** Returns the portal container element, or `undefined` to let Radix default to `document.body`. */
export function usePortalContainer(): HTMLElement | undefined {
  return useContext(PortalContainerContext) ?? undefined
}
