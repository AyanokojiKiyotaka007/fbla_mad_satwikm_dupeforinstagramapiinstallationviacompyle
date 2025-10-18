import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Event } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  index: number;
}

const categoryColors = {
  meeting: COLORS.info,
  competition: COLORS.primary,
  workshop: COLORS.accent,
  social: COLORS.secondary,
};

const categoryIcons = {
  meeting: 'groups' as const,
  competition: 'emoji-events' as const,
  workshop: 'school' as const,
  social: 'celebration' as const,
};

export default function EventCard({ event, onPress, index }: EventCardProps) {
  const categoryColor = categoryColors[event.category];
  const categoryIcon = categoryIcons[event.category];

  return (
    <Animated.View entering={FadeInRight.delay(index * 100).springify()}>
      <TouchableOpacity 
        style={[styles.container, SHADOWS.medium]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <MaterialIcons name={categoryIcon} size={20} color={COLORS.surface} />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{event.date}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{event.time}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.attendeesContainer}>
              <MaterialIcons name="people" size={16} color={COLORS.textLight} />
              <Text style={styles.attendeesText}>{event.attendees} attending</Text>
            </View>
            
            {event.isRegistered && (
              <View style={styles.registeredBadge}>
                <MaterialIcons name="check-circle" size={14} color={COLORS.success} />
                <Text style={styles.registeredText}>Registered</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  categoryBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    paddingRight: 48,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  infoText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  registeredText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
});