import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Event } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  index: number;
}

const categoryIcons = {
  meeting: 'groups' as const,
  competition: 'emoji-events' as const,
  workshop: 'school' as const,
  social: 'celebration' as const,
};

export default function EventCard({ event, onPress, index }: EventCardProps) {
  const { colors, isDarkMode } = useTheme();
  
  const categoryColors = {
    meeting: colors.info,
    competition: colors.primary,
    workshop: colors.accent,
    social: colors.secondary,
  };
  
  const categoryColor = categoryColors[event.category];
  const categoryIcon = categoryIcons[event.category];

  return (
    <Animated.View entering={FadeInRight.delay(index * 100).springify()}>
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <BlurView intensity={isDarkMode ? 30 : 80} style={[styles.container, SHADOWS.medium]}>
          <LinearGradient
            colors={[colors.glass, colors.card]}
            style={styles.gradient}
          >
            <LinearGradient
              colors={[categoryColor, categoryColor + 'CC']}
              style={styles.categoryBadge}
            >
              <MaterialIcons name={categoryIcon} size={22} color="#FFFFFF" />
            </LinearGradient>
            
            <View style={styles.content}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{event.title}</Text>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="calendar-today" size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>{event.date}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="access-time" size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>{event.time}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>{event.location}</Text>
              </View>
              
              <View style={[styles.footer, { borderTopColor: colors.divider }]}>
                <View style={styles.attendeesContainer}>
                  <MaterialIcons name="people" size={18} color={colors.textLight} />
                  <Text style={[styles.attendeesText, { color: colors.textLight }]}>{event.attendees} attending</Text>
                </View>
                
                {event.isRegistered && (
                  <View style={[styles.registeredBadge, { backgroundColor: colors.success + '20' }]}>
                    <MaterialIcons name="check-circle" size={16} color={colors.success} />
                    <Text style={[styles.registeredText, { color: colors.success }]}>Registered</Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  gradient: {
    padding: SPACING.md,
  },
  categoryBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  content: {
    paddingRight: 56,
  },
  title: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  infoText: {
    ...TYPOGRAPHY.bodySmall,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  attendeesText: {
    ...TYPOGRAPHY.caption,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.xs,
  },
  registeredText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
});