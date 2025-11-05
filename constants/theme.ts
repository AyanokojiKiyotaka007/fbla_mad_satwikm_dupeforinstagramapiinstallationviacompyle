// Light and Dark theme colors with glassmorphism support
export const LIGHT_COLORS = {
  primary: '#003DA5',
  primaryDark: '#002D7A',
  primaryLight: '#1E5BC6',
  secondary: '#FFB81C',
  secondaryDark: '#E6A519',
  accent: '#00A3E0',
  
  background: '#F5F7FA',
  backgroundGradient1: '#E8F0FE',
  backgroundGradient2: '#F0F7FF',
  surface: 'rgba(255, 255, 255, 0.7)',
  surfaceSolid: '#FFFFFF',
  card: 'rgba(255, 255, 255, 0.6)',
  
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  
  border: 'rgba(226, 232, 240, 0.5)',
  divider: 'rgba(241, 245, 249, 0.5)',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.4)',
  
  // Glassmorphism
  glass: 'rgba(255, 255, 255, 0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.4)',
};

export const DARK_COLORS = {
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  primaryLight: '#6BA3E8',
  secondary: '#FFB81C',
  secondaryDark: '#E6A519',
  accent: '#00A3E0',
  
  background: '#0F1419',
  backgroundGradient1: '#1A1F2E',
  backgroundGradient2: '#0F1419',
  surface: 'rgba(26, 31, 46, 0.7)',
  surfaceSolid: '#1A1F2E',
  card: 'rgba(37, 42, 53, 0.6)',
  
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textLight: '#6B7280',
  
  border: 'rgba(51, 65, 85, 0.5)',
  divider: 'rgba(30, 41, 59, 0.5)',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Glassmorphism
  glass: 'rgba(26, 31, 46, 0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
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
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
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

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
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