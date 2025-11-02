import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import EventCard from '../components/EventCard';
import { mockEvents } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

interface CalendarScreenProps {
  navigation: any;
}

export default function CalendarScreen({ navigation }: CalendarScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { colors, isDarkMode } = useTheme();

  const filters = [
    { id: 'all', label: 'All Events', icon: 'event' as const },
    { id: 'meeting', label: 'Meetings', icon: 'groups' as const },
    { id: 'competition', label: 'Competitions', icon: 'emoji-events' as const },
    { id: 'workshop', label: 'Workshops', icon: 'school' as const },
    { id: 'social', label: 'Social', icon: 'celebration' as const },
  ];

  const filteredEvents = selectedFilter === 'all' 
    ? mockEvents 
    : mockEvents.filter(e => e.category === selectedFilter);

  return (
    <View style={styles.container}>
      {/* Cohesive Gradient Background */}
      <LinearGradient
        colors={isDarkMode 
          ? [colors.backgroundGradient1, colors.backgroundGradient2, colors.backgroundGradient3]
          : [colors.backgroundGradient1, colors.backgroundGradient2, colors.backgroundGradient3]
        }
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Events</Text>
        </View>

        {/* Filter Chips */}
        <Animated.View entering={FadeIn.duration(600)}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  { 
                    backgroundColor: selectedFilter === filter.id ? colors.primary : colors.surfaceGlass,
                    borderColor: selectedFilter === filter.id ? colors.primary : 'rgba(255, 255, 255, 0.2)',
                  },
                ]}
                onPress={() => setSelectedFilter(filter.id)}
                activeOpacity={0.8}
              >
                <MaterialIcons 
                  name={filter.icon} 
                  size={16} 
                  color={selectedFilter === filter.id ? '#FFFFFF' : colors.textSecondary} 
                />
                <Text style={[
                  styles.filterText,
                  { color: selectedFilter === filter.id ? '#FFFFFF' : colors.textSecondary },
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Events List */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventsContainer}
        >
          <Text style={[styles.resultsText, { color: colors.textLight }]}>
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
          </Text>
          
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => navigation.navigate('EventDetail', { event })}
              index={index}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    fontSize: 28,
  },
  filterContainer: {
    marginBottom: SPACING.lg,
  },
  filterContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    gap: SPACING.xs,
    borderWidth: 1,
  },
  filterText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
  },
  eventsContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: 120,
  },
  resultsText: {
    ...TYPOGRAPHY.elegant,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
});
