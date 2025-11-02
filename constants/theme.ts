// Cohesive gradient theme colors - White → Violet → Blue
export const LIGHT_COLORS = {
  // Primary gradient colors
  primary: '#5B7FDB', // Soft blue
  primaryDark: '#4A6BC4',
  primaryLight: '#7B9FE8',
  secondary: '#9B8FDB', // Soft violet
  secondaryDark: '#8A7EC4',
  accent: '#6BA3E8', // Light blue
  
  // Gradient backgrounds
  background: '#FFFFFF',
  backgroundGradient1: '#FFFFFF', // White
  backgroundGradient2: '#E8E4F3', // Light violet
  backgroundGradient3: '#D6E4F8', // Soft blue
  surface: 'rgba(255, 255, 255, 0.85)',
  surfaceGlass: 'rgba(255, 255, 255, 0.6)',
  card: 'rgba(255, 255, 255, 0.9)',
  
  // Text colors
  text: '#2D3748',
  textSecondary: '#718096',
  textLight: '#A0AEC0',
  
  // Borders and dividers
  border: 'rgba(203, 213, 225, 0.3)',
  divider: 'rgba(226, 232, 240, 0.5)',
  
  // Status colors
  success: '#48BB78',
  warning: '#ED8936',
  error: '#F56565',
  info: '#4299E1',
  
  // Effects
  glow: 'rgba(91, 127, 219, 0.3)',
  shadow: 'rgba(91, 127, 219, 0.15)',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

export const DARK_COLORS = {
  // Primary gradient colors
  primary: '#7B9FE8',
  primaryDark: '#6B8FD8',
  primaryLight: '#8BAFF8',
  secondary: '#B8ACEB',
  secondaryDark: '#A89CDB',
  accent: '#8BB3F8',
  
  // Gradient backgrounds
  background: '#0F1419',
  backgroundGradient1: '#1A1F2E',
  backgroundGradient2: '#1E2235',
  backgroundGradient3: '#1A2332',
  surface: 'rgba(26, 31, 46, 0.85)',
  surfaceGlass: 'rgba(26, 31, 46, 0.6)',
  card: 'rgba(30, 34, 53, 0.9)',
  
  // Text colors
  text: '#F7FAFC',
  textSecondary: '#CBD5E0',
  textLight: '#A0AEC0',
  
  // Borders and dividers
  border: 'rgba(74, 85, 104, 0.3)',
  divider: 'rgba(45, 55, 72, 0.5)',
  
  // Status colors
  success: '#48BB78',
  warning: '#ED8936',
  error: '#F56565',
  info: '#4299E1',
  
  // Effects
  glow: 'rgba(123, 159, 232, 0.3)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const TYPOGRAPHY = {
  // Headers - Bold modern sans-serif (Poppins/Inter style)
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  // Body text - Lighter weights
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  // Special styles
  elegant: {
    fontSize: 14,
    fontWeight: '300' as const,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  soft: {
    shadowColor: '#5B7FDB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#5B7FDB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  glow: {
    shadowColor: '#5B7FDB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
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