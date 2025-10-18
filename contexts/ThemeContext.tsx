import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const lightColors = {
  primary: '#003DA5',
  primaryDark: '#002D7A',
  primaryLight: '#1E5BC6',
  secondary: '#FFB81C',
  secondaryDark: '#E6A519',
  accent: '#00A3E0',
  
  background: '#F8F9FA',
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
};

const darkColors = {
  primary: '#1E5BC6',
  primaryDark: '#003DA5',
  primaryLight: '#4A7FD9',
  secondary: '#FFB81C',
  secondaryDark: '#E6A519',
  accent: '#00A3E0',
  
  background: '#0F1419',
  surface: '#1A1F2E',
  card: '#1A1F2E',
  
  text: '#FFFFFF',
  textSecondary: '#B0B8C4',
  textLight: '#6B7280',
  
  border: '#2D3748',
  divider: '#252D3D',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  shadow: 'rgba(0, 0, 0, 0.3)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}