import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Event } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface EventDetailScreenProps {
  route: {
    params: {
      event: Event;
    };
  };
  navigation: any;
}

const categoryColors = {
  meeting: COLORS.info,
  competition: COLORS.primary,
  workshop: COLORS.accent,
  social: COLORS.secondary,
};

export default function EventDetailScreen({ route, navigation }: EventDetailScreenProps) {
  const { event } = route.params;
  const [isRegistered, setIsRegistered] = useState(event.isRegistered);
  const categoryColor = categoryColors[event.category];

  const handleRegister = () => {
    setIsRegistered(!isRegistered);
    Alert.alert(
      isRegistered ? 'Unregistered' : 'Registered!',
      isRegistered 
        ? `You have been unregistered from "${event.title}"`
        : `You are now registered for "${event.title}"`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <MaterialIcons name="share" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Event Header */}
        <Animated.View 
          entering={FadeIn.duration(600)} 
          style={[styles.eventHeader, SHADOWS.large, { borderTopColor: categoryColor }]}
        >
          <View style={styles.categoryBadge}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {event.category.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </Animated.View>

        {/* Event Info */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()} 
          style={[styles.infoCard, SHADOWS.medium]}
        >
          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: categoryColor + '20' }]}>
              <MaterialIcons name="calendar-today" size={24} color={categoryColor} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{event.date}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: categoryColor + '20' }]}>
              <MaterialIcons name="access-time" size={24} color={categoryColor} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{event.time}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: categoryColor + '20' }]}>
              <MaterialIcons name="location-on" size={24} color={categoryColor} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{event.location}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: categoryColor + '20' }]}>
              <MaterialIcons name="people" size={24} color={categoryColor} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Attendees</Text>
              <Text style={styles.infoValue}>{event.attendees} registered</Text>
            </View>
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()} 
          style={[styles.descriptionCard, SHADOWS.medium]}
        >
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()} 
          style={styles.actionButtons}
        >
          <TouchableOpacity 
            style={[
              styles.registerButton, 
              SHADOWS.medium,
              { backgroundColor: isRegistered ? COLORS.error : categoryColor }
            ]}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name={isRegistered ? 'cancel' : 'check-circle'} 
              size={24} 
              color={COLORS.surface} 
            />
            <Text style={styles.registerButtonText}>
              {isRegistered ? 'Unregister' : 'Register Now'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.calendarButton, SHADOWS.medium]}
            activeOpacity={0.8}
          >
            <MaterialIcons name="event" size={24} color={categoryColor} />
            <Text style={[styles.calendarButtonText, { color: categoryColor }]}>
              Add to Calendar
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  shareButton: {
    padding: SPACING.xs,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  eventHeader: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderTopWidth: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    marginBottom: SPACING.md,
  },
  categoryText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  eventTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '600',
  },
  descriptionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  actionButtons: {
    gap: SPACING.md,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  registerButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.surface,
    fontWeight: '700',
    marginLeft: SPACING.sm,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  calendarButtonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    marginLeft: SPACING.sm,
  },
});