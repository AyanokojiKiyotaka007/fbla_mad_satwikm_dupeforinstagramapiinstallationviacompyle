import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Event } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

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
  const scale = useSharedValue(1);
  
  const categoryColors = {
    meeting: colors.info,
    competition: colors.primary,
    workshop: colors.accent,
    social: colors.secondary,
  };
  
  const categoryColor = categoryColors[event.category];
  const categoryIcon = categoryIcons[event.category];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 100).springify()} style={animatedStyle}>
      <TouchableOpacity 
        style={styles.container} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
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
            {/* Floating category badge */}
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
              <MaterialIcons name={categoryIcon} size={20} color="#FFFFFF" />
            </View>
            
            <View style={styles.content}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{event.title}</Text>
              
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <MaterialIcons name="calendar-today" size={14} color={colors.primary} />
                  </View>
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>{event.date}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconContainer, { backgroundColor: colors.accent + '15' }]}>
                    <MaterialIcons name="access-time" size={14} color={colors.accent} />
                  </View>
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>{event.time}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconContainer, { backgroundColor: colors.secondary + '15' }]}>
                    <MaterialIcons name="location-on" size={14} color={colors.secondary} />
                  </View>
                  <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>{event.location}</Text>
                </View>
              </View>
              
              <View style={[styles.footer, { borderTopColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
                <View style={styles.attendeesContainer}>
                  <View style={styles.avatarStack}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]} />
                    <View style={[styles.avatar, styles.avatarOverlap, { backgroundColor: colors.accent }]} />
                    <View style={[styles.avatar, styles.avatarOverlap, { backgroundColor: colors.secondary }]} />
                  </View>
                  <Text style={[styles.attendeesText, { color: colors.textLight }]}>
                    {event.attendees} attending
                  </Text>
                </View>
                
                {event.isRegistered && (
                  <View style={[styles.registeredBadge, { backgroundColor: colors.success + '20' }]}>
                    <MaterialIcons name="check-circle" size={14} color={colors.success} />
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
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  blurContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gradient: {
    padding: SPACING.lg,
  },
  categoryBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    paddingRight: 56,
  },
  title: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
  },
  infoContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  infoText: {
    ...TYPOGRAPHY.bodySmall,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
    marginRight: SPACING.sm,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  attendeesText: {
    ...TYPOGRAPHY.caption,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  registeredText: {
    ...TYPOGRAPHY.caption,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
});