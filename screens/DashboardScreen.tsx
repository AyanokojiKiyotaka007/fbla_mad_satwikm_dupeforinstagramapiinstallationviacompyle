import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated as RNAnimated, Share, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Calendar from 'expo-calendar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { mockEvents } from '../data/mockData';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const QUOTES = [
  'Connect. Lead. Inspire.',
  'Innovation starts with you.',
  'Building Leaders of Tomorrow.',
  'Connecting Creativity.',
  'Your future begins today.',
];

interface DashboardScreenProps {
  navigation: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const waveAnim = useRef(new RNAnimated.Value(0)).current;
  const quoteOpacity = useRef(new RNAnimated.Value(1)).current;
  const glowPulse = useRef(new RNAnimated.Value(1)).current;

  const upcomingEvent = mockEvents.find(e => e.isRegistered);

  useEffect(() => {
    // Set current date
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString('en-US', options));

    // Wave animation
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(waveAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(waveAnim, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow pulse animation
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(glowPulse, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(glowPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Quote rotation
    const quoteInterval = setInterval(() => {
      RNAnimated.sequence([
        RNAnimated.timing(quoteOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        RNAnimated.timing(quoteOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 6000);

    return () => clearInterval(quoteInterval);
  }, [waveAnim, quoteOpacity, glowPulse]);

  const waveTranslate = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const addToCalendar = async () => {
    if (!upcomingEvent) return;

    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendar = calendars.find(cal => cal.allowsModifications) || calendars[0];

        if (defaultCalendar) {
          const eventDate = new Date(upcomingEvent.date);
          await Calendar.createEventAsync(defaultCalendar.id, {
            title: upcomingEvent.title,
            startDate: eventDate,
            endDate: new Date(eventDate.getTime() + 2 * 60 * 60 * 1000),
            location: upcomingEvent.location,
            notes: upcomingEvent.description,
          });
          alert('Event added to calendar!');
        }
      }
    } catch (error) {
      console.error('Error adding to calendar:', error);
      alert('Could not add event to calendar');
    }
  };

  const shareEvent = async () => {
    if (!upcomingEvent) return;

    try {
      await Share.share({
        message: `${upcomingEvent.title}\n\nDate: ${upcomingEvent.date}\nTime: ${upcomingEvent.time}\nLocation: ${upcomingEvent.location}\n\n${upcomingEvent.description}`,
        title: upcomingEvent.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

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

      {/* Animated Wave Overlay */}
      <RNAnimated.View
        style={[
          styles.waveOverlay,
          {
            transform: [{ translateY: waveTranslate }],
            opacity: isDarkMode ? 0.15 : 0.08,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primary + '60', colors.secondary + '60', colors.accent + '60']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </RNAnimated.View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Centered Greeting Section */}
          <Animated.View entering={FadeInUp.duration(800)} style={styles.greetingSection}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Welcome back, {user?.name?.split(' ')[0] || 'Member'}
            </Text>
            <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
              Ready to make an impact today?
            </Text>
            <Text style={[styles.dateText, { color: colors.textLight }]}>
              {currentDate}
            </Text>
          </Animated.View>

          {/* Floating Quote Section with Glow */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <RNAnimated.View style={[styles.quoteContainer, { transform: [{ scale: glowPulse }] }]}>
              <View style={[styles.quoteGlass, { backgroundColor: colors.surfaceGlass }]}>
                <RNAnimated.View style={{ opacity: quoteOpacity }}>
                  <Text style={[styles.quote, { color: colors.primary }]}>
                    {QUOTES[currentQuoteIndex]}
                  </Text>
                </RNAnimated.View>
                <View style={styles.quoteIndicators}>
                  {QUOTES.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        {
                          backgroundColor: index === currentQuoteIndex ? colors.primary : colors.textLight,
                          opacity: index === currentQuoteIndex ? 1 : 0.3,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </RNAnimated.View>
          </Animated.View>

          {/* Upcoming Event Panel - Flowing Design */}
          {upcomingEvent && (
            <Animated.View entering={FadeInDown.delay(400).springify()}>
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => navigation.navigate('EventDetail', { event: upcomingEvent })}
              >
                <View style={[styles.eventCard, { backgroundColor: colors.surfaceGlass }]}>
                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <View style={[styles.eventIconContainer, { backgroundColor: colors.primary }]}>
                        <MaterialIcons name="event" size={20} color="#FFFFFF" />
                      </View>
                      <Text style={[styles.eventLabel, { color: colors.textLight }]}>
                        UPCOMING EVENT
                      </Text>
                    </View>
                    
                    <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>
                      {upcomingEvent.title}
                    </Text>
                    
                    <View style={styles.eventDetails}>
                      <View style={styles.eventDetailRow}>
                        <MaterialIcons name="calendar-today" size={14} color={colors.textSecondary} />
                        <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                          {upcomingEvent.date}
                        </Text>
                      </View>
                      <View style={styles.eventDetailRow}>
                        <MaterialIcons name="access-time" size={14} color={colors.textSecondary} />
                        <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                          {upcomingEvent.time}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.eventActions}>
                      <TouchableOpacity 
                        style={[styles.eventActionButton, { backgroundColor: colors.primary }]}
                        onPress={addToCalendar}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons name="event-available" size={16} color="#FFFFFF" />
                        <Text style={styles.eventActionText}>Add to Calendar</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.shareButton, { backgroundColor: colors.surface }]}
                        onPress={shareEvent}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons name="share" size={18} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  waveOverlay: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    height: height * 0.7,
    borderBottomLeftRadius: width * 1.5,
    borderBottomRightRadius: width * 1.5,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 120,
    alignItems: 'center',
  },
  greetingSection: {
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  greeting: {
    ...TYPOGRAPHY.h1,
    fontSize: 34,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subGreeting: {
    ...TYPOGRAPHY.body,
    fontSize: 17,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  dateText: {
    ...TYPOGRAPHY.elegant,
    fontSize: 13,
    textAlign: 'center',
  },
  quoteContainer: {
    width: width - SPACING.xl * 2,
    marginBottom: SPACING.xl,
  },
  quoteGlass: {
    borderRadius: 28,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quote: {
    ...TYPOGRAPHY.h3,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: SPACING.lg,
    letterSpacing: 0.3,
  },
  quoteIndicators: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eventCard: {
    width: width - SPACING.xl * 2,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  eventContent: {
    padding: SPACING.xl,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  eventIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  eventLabel: {
    ...TYPOGRAPHY.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  eventTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 22,
    marginBottom: SPACING.md,
  },
  eventDetails: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  eventDetailText: {
    ...TYPOGRAPHY.bodySmall,
  },
  eventActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'center',
  },
  eventActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 16,
    gap: SPACING.sm,
  },
  eventActionText: {
    ...TYPOGRAPHY.bodySmall,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});