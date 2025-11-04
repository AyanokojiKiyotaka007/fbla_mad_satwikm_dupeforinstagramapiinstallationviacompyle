// Enhanced Light and Dark theme colors with smooth gradients
export const LIGHT_COLORS = {
  primary: '#003DA5',
  primaryDark: '#002D7A',
  primaryLight: '#1E5BC6',
  secondary: '#FFB81C',
  secondaryDark: '#E6A519',
  accent: '#00A3E0',
  
  // Smooth gradient backgrounds
  background: '#F8FAFF',
  backgroundGradient1: '#E8F0FE',
  backgroundGradient2: '#F5F8FF',
  backgroundGradient3: '#FDFEFF',
  surface: 'rgba(255, 255, 255, 0.85)',
  surfaceSolid: '#FFFFFF',
  card: 'rgba(255, 255, 255, 0.75)',
  
  // Enhanced text colors
  text: '#0F172A',
  textSecondary: '#475569',
  textLight: '#94A3B8',
  
  border: 'rgba(226, 232, 240, 0.8)',
  divider: 'rgba(241, 245, 249, 0.6)',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Glassmorphism effects
  glass: 'rgba(255, 255, 255, 0.7)',
  glassStrong: 'rgba(255, 255, 255, 0.9)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
  
  shadow: 'rgba(0, 61, 165, 0.08)',
  shadowStrong: 'rgba(0, 61, 165, 0.15)',
  overlay: 'rgba(0, 0, 0, 0.4)',
  
  // Accent glows
  primaryGlow: 'rgba(0, 61, 165, 0.15)',
  secondaryGlow: 'rgba(255, 184, 28, 0.15)',
  accentGlow: 'rgba(0, 163, 224, 0.15)',
};

export const DARK_COLORS = {
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  primaryLight: '#6BA3E8',
  secondary: '#FFB81C',
  secondaryDark: '#E6A519',
  accent: '#00A3E0',
  
  // Smooth gradient backgrounds
  background: '#0A0E1A',
  backgroundGradient1: '#0F1419',
  backgroundGradient2: '#1A1F2E',
  backgroundGradient3: '#0F1419',
  surface: 'rgba(26, 31, 46, 0.85)',
  surfaceSolid: '#1A1F2E',
  card: 'rgba(37, 42, 53, 0.75)',
  
  // Enhanced text colors
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textLight: '#64748B',
  
  border: 'rgba(51, 65, 85, 0.6)',
  divider: 'rgba(30, 41, 59, 0.5)',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Glassmorphism effects
  glass: 'rgba(26, 31, 46, 0.7)',
  glassStrong: 'rgba(26, 31, 46, 0.9)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowStrong: 'rgba(0, 0, 0, 0.5)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Accent glows
  primaryGlow: 'rgba(74, 144, 226, 0.2)',
  secondaryGlow: 'rgba(255, 184, 28, 0.2)',
  accentGlow: 'rgba(0, 163, 224, 0.2)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Enhanced typography with better hierarchy
export const TYPOGRAPHY = {
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
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
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
  captionBold: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
};

// Enhanced shadows with glassmorphism
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: '#003DA5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};