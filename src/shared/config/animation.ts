/**
 * Shared animation constants and variants for Framer Motion.
 * Replaces legacy "apple" prefixed animations with a generic naming convention.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

/**
 * Standard spring: stiffness 400, damping 30.
 * Best for snappy, responsive UI interactions.
 */
export const spring1 = {
  type: "spring",
  stiffness: 400,
  damping: 30,
} as const;

/**
 * Heavy spring: mass 0.8, stiffness 400, damping 30.
 * Best for larger cards and sections with a bit more gravity.
 */
export const spring2 = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
} as const;

/**
 * Technical spring: bounce 0, duration 0.6.
 * Best for layout transitions and segmented controls.
 */
export const spring3 = {
  type: "spring",
  bounce: 0,
  duration: 0.6,
} as const;

/**
 * Standard cubic-bezier ease for smooth transitions.
 * Equivalent to Apple's system ease.
 */
export const ease1 = [0.32, 0.72, 0, 1] as const;

/**
 * Standard cubic-bezier ease for smooth transitions (Variation).
 */
export const ease2 = [0.25, 1, 0.5, 1] as const;

// ─── Variants ────────────────────────────────────────────────────────────────

/**
 * Stagger children container variants.
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
} as const;

/**
 * Standard stagger item variants.
 */
export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: ease1,
    },
  },
} as const;
