import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

interface StatCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  value: string | number;
  label: string;
  color: string;
  index: number;
}

export default function StatCard({ icon, value, label, color, index }: StatCardProps) {
  const { colors, isDarkMode } = useTheme();
  
  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()}
      style={styles.container}
    >
      <BlurView intensity={isDarkMode ? 30 : 90} style={styles.blurContainer}>
        <LinearGradient
          colors={isDarkMode 
            ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
            : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.6)']
          }
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <LinearGradient
            colors={[color, color + 'DD']}
            style={styles.iconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name={icon} size={28} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gradient: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  value: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
});