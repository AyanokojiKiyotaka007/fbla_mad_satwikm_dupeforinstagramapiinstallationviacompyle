import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated as RNAnimated, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { mockEvents } from '../data/mockData';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const floatAnim = useRef(new RNAnimated.Value(0)).current;
  const quoteOpacity = useRef(new RNAnimated.Value(1)).current;

  const upcomingEvent = mockEvents.find(e => e.isRegistered);

  useEffect(() => {
    // Update date every minute
    const dateInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    // Gentle floating animation
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Quote rotation
    const quoteInterval = setInterval(() => {
      RNAnimated.sequence([
        RNAnimated.timing(quoteOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        RNAnimated.timing(quoteOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 5000);

    return () => {
      clearInterval(dateInterval);
      clearInterval(quoteInterval);
    };
  }, [floatAnim, quoteOpacity]);

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const openSocialMedia = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  // Format date
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNumber = currentDate.getDate();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <View style={styles.container}>
      {/* Smooth Full-Screen Gradient Background */}
      <LinearGradient
        colors={isDarkMode 
          ? [colors.backgroundGradient1, colors.backgroundGradient2, colors.backgroundGradient3, colors.backgroundGradient1]
          : [colors.backgroundGradient1, colors.backgroundGradient2, colors.backgroundGradient3, '#FFFFFF']
        }
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
      />

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
              {dayName}, {monthName} {dayNumber}, {year}
            </Text>
          </Animated.View>

          {/* Inspirational Quote with Gradient Text */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <RNAnimated.View style={{ transform: [{ translateY: floatTranslate }] }}>
              <BlurView intensity={isDarkMode ? 25 : 70} style={styles.quoteContainer}>
                <LinearGradient
                  colors={[colors.glass, colors.glass]}
                  style={styles.quoteGradient}
                >
                  <RNAnimated.View style={{ opacity: quoteOpacity }}>
                    <LinearGradient
                      colors={[colors.primary, colors.accent]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.quoteTextGradient}
                    >
                      <Text style={[styles.quote, { color: 'transparent' }]}>
                        {QUOTES[currentQuoteIndex]}
                      </Text>
                    </LinearGradient>
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
                </LinearGradient>
              </BlurView>
            </RNAnimated.View>
          </Animated.View>

          {/* Upcoming Event Card with Enhanced Glassmorphism */}
          {upcomingEvent && (
            <Animated.View entering={FadeInDown.delay(400).springify()}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('EventDetail', { event: upcomingEvent })}
              >
                <BlurView intensity={isDarkMode ? 30 : 80} style={[styles.eventCard, SHADOWS.medium]}>
                  <LinearGradient
                    colors={[colors.glass, colors.card]}
                    style={styles.eventGradient}
                  >
                    <View style={styles.eventHeader}>
                      <LinearGradient
                        colors={[colors.primary, colors.primaryLight]}
                        style={styles.eventIconContainer}
                      >
                        <MaterialIcons name="event" size={26} color="#FFFFFF" />
                      </LinearGradient>
                      <View style={styles.eventHeaderText}>
                        <Text style={[styles.eventLabel, { color: colors.textLight }]}>
                          NEXT EVENT
                        </Text>
                        <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>
                          {upcomingEvent.title}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.eventDetails}>
                      <View style={styles.eventDetailRow}>
                        <MaterialIcons name="calendar-today" size={18} color={colors.primary} />
                        <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                          {upcomingEvent.date}
                        </Text>
                      </View>
                      <View style={styles.eventDetailRow}>
                        <MaterialIcons name="access-time" size={18} color={colors.primary} />
                        <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                          {upcomingEvent.time}
                        </Text>
                      </View>
                      <View style={styles.eventDetailRow}>
                        <MaterialIcons name="location-on" size={18} color={colors.primary} />
                        <Text style={[styles.eventDetailText, { color: colors.textSecondary }]} numberOfLines={1}>
                          {upcomingEvent.location}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Action Buttons */}
                    <View style={styles.eventActions}>
                      <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primaryGlow }]}>
                        <MaterialIcons name="event-available" size={18} color={colors.primary} />
                        <Text style={[styles.actionButtonText, { color: colors.primary }]}>Add to Calendar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.accentGlow }]}>
                        <MaterialIcons name="share" size={18} color={colors.accent} />
                        <Text style={[styles.actionButtonText, { color: colors.accent }]}>Share</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Announcements Card */}
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <BlurView intensity={isDarkMode ? 30 : 80} style={[styles.announcementCard, SHADOWS.medium]}>
              <LinearGradient
                colors={[colors.glass, colors.card]}
                style={styles.announcementGradient}
              >
                <View style={styles.announcementHeader}>
                  <View style={[styles.announcementIcon, { backgroundColor: colors.secondaryGlow }]}>
                    <MaterialIcons name="campaign" size={22} color={colors.secondary} />
                  </View>
                  <Text style={[styles.announcementTitle, { color: colors.text }]}>Latest Announcements</Text>
                </View>
                <Text style={[styles.announcementText, { color: colors.textSecondary }]}>
                  1 new announcement • Tap to view details
                </Text>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Quick Actions with Enhanced Design */}
          <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.quickActionsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <QuickActionButton
                icon="event"
                label="Calendar"
                color={colors.primary}
                onPress={() => navigation.navigate('Calendar')}
                colors={colors}
                isDarkMode={isDarkMode}
              />
              <QuickActionButton
                icon="article"
                label="News"
                color={colors.secondary}
                onPress={() => navigation.navigate('NewsFeed')}
                colors={colors}
                isDarkMode={isDarkMode}
              />
              <QuickActionButton
                icon="folder"
                label="Resources"
                color={colors.accent}
                onPress={() => navigation.navigate('Resources')}
                colors={colors}
                isDarkMode={isDarkMode}
              />
            </View>
          </Animated.View>

          {/* Social Media Section */}
          <Animated.View entering={FadeInDown.delay(1000).springify()} style={styles.socialSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Connect With Us</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                onPress={() => openSocialMedia('https://www.instagram.com/fbla_pbl/')}
                activeOpacity={0.8}
              >
                <BlurView intensity={isDarkMode ? 30 : 80} style={[styles.socialButton, SHADOWS.small]}>
                  <LinearGradient
                    colors={[colors.glass, colors.card]}
                    style={styles.socialButtonGradient}
                  >
                    <LinearGradient
                      colors={['#833AB4', '#FD1D1D', '#F77737']}
                      style={styles.socialIconGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <MaterialIcons name="camera-alt" size={24} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={[styles.socialLabel, { color: colors.text }]}>Instagram</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openSocialMedia('https://twitter.com/FBLA_PBL')}
                activeOpacity={0.8}
              >
                <BlurView intensity={isDarkMode ? 30 : 80} style={[styles.socialButton, SHADOWS.small]}>
                  <LinearGradient
                    colors={[colors.glass, colors.card]}
                    style={styles.socialButtonGradient}
                  >
                    <View style={[styles.socialIconGradient, { backgroundColor: '#1DA1F2' }]}>
                      <MaterialIcons name="tag" size={24} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.socialLabel, { color: colors.text }]}>Twitter/X</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function QuickActionButton({ icon, label, color, onPress, colors, isDarkMode }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.quickActionButton}>
      <BlurView intensity={isDarkMode ? 30 : 80} style={[styles.quickActionBlur, SHADOWS.small]}>
        <LinearGradient
          colors={[colors.glass, colors.card]}
          style={styles.quickActionGradient}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
            <MaterialIcons name={icon} size={28} color={color} />
          </View>
          <Text style={[styles.quickActionLabel, { color: colors.text }]}>{label}</Text>
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 120,
  },
  greetingSection: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  greeting: {
    ...TYPOGRAPHY.h1,
    fontSize: 30,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subGreeting: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    textAlign: 'center',
  },
  quoteContainer: {
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  quoteGradient: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  quoteTextGradient: {
    borderRadius: BORDER_RADIUS.md,
  },
  quote: {
    ...TYPOGRAPHY.h4,
    fontSize: 17,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  quoteIndicators: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eventCard: {
    borderRadius: BORDER_RADIUS.xxl,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  eventGradient: {
    padding: SPACING.lg,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  eventIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  eventHeaderText: {
    flex: 1,
  },
  eventLabel: {
    ...TYPOGRAPHY.captionBold,
    marginBottom: SPACING.xs,
  },
  eventTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 19,
  },
  eventDetails: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  eventDetailText: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 15,
  },
  eventActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  actionButtonText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  announcementCard: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  announcementGradient: {
    padding: SPACING.md,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  announcementIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  announcementTitle: {
    ...TYPOGRAPHY.h4,
    fontSize: 17,
  },
  announcementText: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: 48,
  },
  quickActionsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  quickActionButton: {
    flex: 1,
  },
  quickActionBlur: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionLabel: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  socialSection: {
    marginBottom: SPACING.lg,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  socialButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  socialButtonGradient: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  socialIconGradient: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  socialLabel: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
});