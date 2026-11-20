/**
 * THEME CONFIGURATION
 * ---------------------------------------------------------------------------
 * Ex-tra Gadgets — Wine / Black / White Brand Identity
 *
 * tailwind.config.js imports this file directly, so changing values here
 * re-themes the storefront and admin dashboard without editing components.
 *
 * LEGACY TOKEN COMPATIBILITY:
 * Existing components use token names such as:
 * emerald, emerald-light, emerald-dark, gold, gold-light, gold-dark,
 * ivory, charcoal, muted and terracotta.
 *
 * These names are intentionally preserved to avoid breaking existing
 * Tailwind classes and application functionality.
 *
 * BRAND COLOUR MAPPING:
 * emerald     -> Wine / Burgundy (primary brand colour)
 * gold        -> Near-black (secondary accent)
 * ivory       -> White
 * charcoal    -> Dark charcoal
 * muted       -> Neutral grey
 * terracotta  -> Wine / Burgundy
 *
 * BRAND IDENTITY:
 * Wine / Burgundy + Black + White
 */

export const THEME = {
  colors: {
    // Legacy tokens mapped to Ex-tra Gadgets brand colours.
    emerald: {
      DEFAULT: '#722F45',
      light: '#91465F',
      dark: '#512031',
    },

    gold: {
      DEFAULT: '#171717',
      light: '#3F3F3F',
      dark: '#000000',
    },

    ivory: '#FFFFFF',
    charcoal: '#171717',
    muted: '#6B7280',
    terracotta: '#722F45',

    // Keep WhatsApp's official green for WhatsApp actions.
    whatsapp: '#25D366',

    // New tokens for newly developed sections.
    primary: '#722F45',
    primaryHover: '#512031',
    primaryLight: '#F4E9ED',
    primaryDark: '#512031',

    black: '#111111',
    white: '#FFFFFF',

    surface: '#FAF8F9',
    border: '#E7DDE1',
    ink: '#171717',
  },

  fontFamily: {
    display: ['"Sora"', 'sans-serif'],
    body: ['"Inter"', 'sans-serif'],
  },

  boxShadow: {
    card: '0 2px 12px rgba(17, 17, 17, 0.06)',
    'card-hover': '0 10px 28px rgba(17, 17, 17, 0.12)',
    brand: '0 4px 14px rgba(114, 47, 69, 0.16)',
  },

  borderRadius: {
    xl: '0.75rem',
  },
};
