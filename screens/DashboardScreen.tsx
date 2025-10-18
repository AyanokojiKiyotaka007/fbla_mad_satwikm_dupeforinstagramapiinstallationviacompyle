import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import StatCard from '../components/StatCard';
import EventCard from '../components/EventCard';
import { mockDashboardStats, mockEvents } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface DashboardScreenProps {
  navigation: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const upcomingEvents = mockEvents.filter(e => e.isRegistered).slice(0, 2);
  const { user } = useAuth();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Member'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <MaterialIcons name="account-circle" size={40} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="event"
            value={mockDashboardStats.upcomingEvents}
            label="Upcoming Events"
            color={colors.primary}
            index={0}
          />
          <StatCard
            icon="notifications"
            value={mockDashboardStats.unreadNews}
            label="Unread News"
            color={colors.secondary}
            index={1}
          />
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            icon="folder"
            value={mockDashboardStats.savedResources}
            label="Saved Resources"
            color={colors.accent}
            index={2}
          />
          <StatCard
            icon="stars"
            value={mockDashboardStats.membershipDays}
            label="Days as Member"
            color={colors.success}
            index={3}
          />
        </View>

        {/* Quick Actions */}
        <Animated.View 
          entering={FadeIn.delay(400).duration(600)} 
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface }, SHADOWS.medium]}
              onPress={() => navigation.navigate('Calendar')}
            >
              <MaterialIcons name="calendar-today" size={24} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface }, SHADOWS.medium]}
              onPress={() => navigation.navigate('NewsFeed')}
            >
              <MaterialIcons name="article" size={24} color={colors.secondary} />
              <Text style={[styles.actionText, { color: colors.text }]}>News</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface }, SHADOWS.medium]}
              onPress={() => navigation.navigate('Resources')}
            >
              <MaterialIcons name="folder-open" size={24} color={colors.accent} />
              <Text style={[styles.actionText, { color: colors.text }]}>Files</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Upcoming Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
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
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  greeting: {
    ...TYPOGRAPHY.body,
  },
  userName: {
    ...TYPOGRAPHY.h2,
    marginTop: SPACING.xs,
  },
  profileButton: {
    padding: SPACING.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
  },
  seeAllText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  actionText: {
    ...TYPOGRAPHY.bodySmall,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});
