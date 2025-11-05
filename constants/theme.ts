// Premium Light and Dark theme colors with refined glassmorphism
export const LIGHT_COLORS = {
  primary: '#003DA5',
  primaryDark: '#002D7A',
  primaryLight: '#1E5BC6',
  secondary: '#FFB81C',
  secondaryDark: '#E6A519',
  accent: '#00A3E0',
  
  // Refined background with full-screen gradient
  background: '#F5F8FF',
  backgroundGradient1: '#E6EFFD',
  backgroundGradient2: '#EEF4FF',
  backgroundGradient3: '#F8FBFF',
  backgroundGradient4: '#FFFFFF',
  
  // Enhanced glassmorphism surfaces with better definition
  surface: 'rgba(255, 255, 255, 0.8)',
  surfaceSolid: '#FFFFFF',
  card: 'rgba(255, 255, 255, 0.72)',
  cardGradient1: 'rgba(255, 255, 255, 0.85)',
  cardGradient2: 'rgba(255, 255, 255, 0.65)',
  
  // Crisp, high-contrast text colors
  text: '#0A0F1C',
  textSecondary: '#3D4A5C',
  textLight: '#6B7A8F',
  
  // Enhanced borders with better definition
  border: 'rgba(203, 213, 225, 0.5)',
  divider: 'rgba(226, 232, 240, 0.4)',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Enhanced shadows with blue tint
  shadow: 'rgba(0, 61, 165, 0.06)',
  shadowMedium: 'rgba(0, 61, 165, 0.10)',
  shadowStrong: 'rgba(0, 61, 165, 0.14)',
  overlay: 'rgba(0, 0, 0, 0.4)',
  
  // Premium glassmorphism with edge glow
  glass: 'rgba(255, 255, 255, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.8)',
  glassEdge: 'rgba(255, 255, 255, 0.95)',
  glassReflection: 'rgba(255, 255, 255, 0.98)',
  glassShimmer: 'rgba(0, 61, 165, 0.03)',
};

export const DARK_COLORS = {
  primary: '#5A9FEE',
  primaryDark: '#357ABD',
  primaryLight: '#7BB3F2',
  secondary: '#FFB81C',
  secondaryDark: '#E6A519',
  accent: '#00A3E0',
  
  // Refined dark background
  background: '#0A0E1A',
  backgroundGradient1: '#0F1419',
  backgroundGradient2: '#1A1F2E',
  backgroundGradient3: '#0F1419',
  backgroundGradient4: '#0A0E1A',
  
  // Enhanced dark glassmorphism
  surface: 'rgba(26, 31, 46, 0.75)',
  surfaceSolid: '#1A1F2E',
  card: 'rgba(37, 42, 53, 0.65)',
  cardGradient1: 'rgba(26, 31, 46, 0.5)',
  cardGradient2: 'rgba(37, 42, 53, 0.4)',
  
  // High-contrast dark text
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textLight: '#94A3B8',
  
  border: 'rgba(71, 85, 105, 0.5)',
  divider: 'rgba(51, 65, 85, 0.4)',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowMedium: 'rgba(0, 0, 0, 0.4)',
  shadowStrong: 'rgba(0, 0, 0, 0.5)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Enhanced dark glassmorphism
  glass: 'rgba(26, 31, 46, 0.7)',
  glassBorder: 'rgba(90, 159, 238, 0.2)',
  glassEdge: 'rgba(90, 159, 238, 0.15)',
  glassReflection: 'rgba(90, 159, 238, 0.1)',
  glassShimmer: 'rgba(90, 159, 238, 0.05)',
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

// Enhanced shadows with better depth
export const SHADOWS = {
  small: {
    shadowColor: '#003DA5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: '#003DA5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },
  large: {
    shadowColor: '#003DA5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 8,
  },
  glow: {
    shadowColor: '#003DA5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
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