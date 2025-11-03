import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={isDarkMode 
          ? ['#0F1419', '#1A1F2E', '#0F1419']
          : ['#E8F0FE', '#F0F7FF', '#FFFFFF']
        }
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Event Calendar</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {filteredEvents.length} upcoming events
            </Text>
          </View>
          <TouchableOpacity style={styles.addButtonContainer}>
            <BlurView intensity={isDarkMode ? 30 : 90} style={styles.addButtonBlur}>
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.addButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name="add" size={24} color="#FFFFFF" />
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Filter Chips */}
        <Animated.View entering={FadeIn.delay(200).duration(600)}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {filters.map((filter, index) => (
              <Animated.View key={filter.id} entering={FadeInDown.delay(300 + index * 50).springify()}>
                <TouchableOpacity
                  style={styles.filterChipContainer}
                  onPress={() => setSelectedFilter(filter.id)}
                  activeOpacity={0.8}
                >
                  <BlurView 
                    intensity={isDarkMode ? 30 : 90} 
                    style={[
                      styles.filterChip,
                      selectedFilter === filter.id && styles.filterChipActive
                    ]}
                  >
                    {selectedFilter === filter.id && (
                      <LinearGradient
                        colors={[colors.primary, colors.primaryLight]}
                        style={StyleSheet.absoluteFillObject}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                    )}
                    <MaterialIcons 
                      name={filter.icon} 
                      size={18} 
                      color={selectedFilter === filter.id ? '#FFFFFF' : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.filterText,
                      { color: selectedFilter === filter.id ? '#FFFFFF' : colors.textSecondary },
                    ]}>
                      {filter.label}
                    </Text>
                  </BlurView>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Events List */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventsContainer}
        >
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    marginTop: SPACING.xs,
  },
  addButtonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    marginBottom: SPACING.md,
  },
  filterContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  filterChipContainer: {
    marginRight: SPACING.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  filterChipActive: {
    borderColor: 'transparent',
  },
  filterText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  eventsContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: 120,
  },
});