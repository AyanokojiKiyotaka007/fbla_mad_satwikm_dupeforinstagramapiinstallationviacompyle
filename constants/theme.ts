// Light Mode - Clean, Modern, Weightless
export const LIGHT_COLORS = {
  // Primary Accent - Cool medium blue
  primary: '#4C6EF5',
  primaryDark: '#4263EC',
  primaryLight: '#5A8DFE',
  
  // Secondary Accent - Lavender / soft violet
  secondary: '#A78BFA',
  secondaryDark: '#9F7AEA',
  secondaryLight: '#B9A6FF',
  
  // FBLA Gold (for specific branding elements)
  accent: '#FFB81C',
  
  // Background - Smooth gradient from white → very light violet → soft pastel blue
  background: '#FFFFFF',
  backgroundGradient1: '#FFFFFF',
  backgroundGradient2: '#F5F7FF',
  backgroundGradient3: '#E8EFFF',
  
  // Cards / Panels - White with slight bluish tint
  surface: '#FFFFFF',
  surfaceTint: '#F5F7FF',
  card: '#F5F7FF',
  
  // Typography
  text: '#1E1E2E', // Deep neutral gray for headers
  textSecondary: '#5B5B6A', // Subtext
  textLight: '#9A9AA9', // Muted text
  
  // Borders & Dividers
  border: '#E8EFFF',
  divider: '#F0F4FF',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#5A8DFE',
  
  // Effects
  shadow: 'rgba(76, 110, 245, 0.08)',
  glow: 'rgba(207, 224, 255, 0.3)',
  overlay: 'rgba(30, 30, 46, 0.5)',
};

// Dark Mode - Sleek, Immersive, Reflective
export const DARK_COLORS = {
  // Primary Accent - Bright electric blue
  primary: '#5B8BFF',
  primaryDark: '#4C7AE8',
  primaryLight: '#6B9BFF',
  
  // Secondary Accent - Violet glow tone
  secondary: '#9F8CFF',
  secondaryDark: '#8F7AEA',
  secondaryLight: '#AF9CFF',
  
  // FBLA Gold (for specific branding elements)
  accent: '#FFB81C',
  
  // Background - Gradient from deep navy blue → muted indigo → soft violet-gray
  background: '#0D1B2A',
  backgroundGradient1: '#0D1B2A',
  backgroundGradient2: '#1B2A49',
  backgroundGradient3: '#2A3171',
  
  // Cards / Panels - Deep grayish navy with translucent overlay
  surface: '#1C2233',
  surfaceTint: '#1C2233',
  card: '#1C2233',
  
  // Typography
  text: '#F5F7FF', // Header
  textSecondary: '#C9D1E6', // Body
  textLight: '#8A90A6', // Muted
  
  // Borders & Dividers
  border: '#2A3447',
  divider: '#252D3E',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#5B8BFF',
  
  // Effects
  shadow: 'rgba(0, 0, 0, 0.3)',
  glow: 'rgba(91, 139, 255, 0.25)',
  overlay: 'rgba(13, 27, 42, 0.7)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

// Light Mode Shadows - Soft, opacity <10%
export const LIGHT_SHADOWS = {
  small: {
    shadowColor: '#4C6EF5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#4C6EF5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#4C6EF5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#CFE0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Dark Mode Shadows - Softer, cooler, neon-style glows
export const DARK_SHADOWS = {
  small: {
    shadowColor: '#5B8BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#5B8BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#5B8BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#5B8BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};