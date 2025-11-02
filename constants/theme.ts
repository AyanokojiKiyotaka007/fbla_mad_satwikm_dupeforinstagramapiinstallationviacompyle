// Light and Dark theme colors
export const LIGHT_COLORS = {
  primary: '#003DA5',
  primaryDark: '#002D7A',
  primaryLight: '#1E5BC6',
  secondary: '#FFB81C',
  secondaryDark: '#E6A519',
  accent: '#00A3E0',
  
  background: '#F8F9FA',
  backgroundGradient1: '#E8F0FE',
  backgroundGradient2: '#F0F7FF',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  
  border: '#E5E7EB',
  divider: '#F3F4F6',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
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
  surface: '#1A1F2E',
  card: '#252A35',
  
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textLight: '#6B7280',
  
  border: '#2D3748',
  divider: '#252A35',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
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

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
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