import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import StatCard from '../components/StatCard';
import EventCard from '../components/EventCard';
import { mockDashboardStats, mockEvents, mockUserProfile } from '../data/mockData';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface DashboardScreenProps {
  navigation: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const upcomingEvents = mockEvents.filter(e => e.isRegistered).slice(0, 2);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{mockUserProfile.name}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <MaterialIcons name="account-circle" size={40} color={COLORS.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="event"
            value={mockDashboardStats.upcomingEvents}
            label="Upcoming Events"
            color={COLORS.primary}
            index={0}
          />
          <StatCard
            icon="notifications"
            value={mockDashboardStats.unreadNews}
            label="Unread News"
            color={COLORS.secondary}
            index={1}
          />
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            icon="folder"
            value={mockDashboardStats.savedResources}
            label="Saved Resources"
            color={COLORS.accent}
            index={2}
          />
          <StatCard
            icon="stars"
            value={mockDashboardStats.membershipDays}
            label="Days as Member"
            color={COLORS.success}
            index={3}
          />
        </View>

        {/* Quick Actions */}
        <Animated.View 
          entering={FadeIn.delay(400).duration(600)} 
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionButton, SHADOWS.medium]}
              onPress={() => navigation.navigate('Calendar')}
            >
              <MaterialIcons name="calendar-today" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>View Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, SHADOWS.medium]}
              onPress={() => navigation.navigate('NewsFeed')}
            >
              <MaterialIcons name="article" size={24} color={COLORS.secondary} />
              <Text style={styles.actionText}>Read News</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, SHADOWS.medium]}
              onPress={() => navigation.navigate('Resources')}
            >
              <MaterialIcons name="folder-open" size={24} color={COLORS.accent} />
              <Text style={styles.actionText}>Browse Files</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Upcoming Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => navigation.navigate('EventDetail', { event })}
              index={index}
            />
          ))}
        </View>
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
    paddingVertical: SPACING.lg,
  },
  greeting: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  userName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  profileButton: {
    padding: SPACING.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  seeAllText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  actionText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});