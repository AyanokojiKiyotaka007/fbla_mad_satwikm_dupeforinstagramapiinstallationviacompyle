import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated as RNAnimated, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { mockEvents } from '../data/mockData';
import { SPACING, TYPOGRAPHY } from '../constants/theme';

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
  const waveAnim = useRef(new RNAnimated.Value(0)).current;
  const quoteOpacity = useRef(new RNAnimated.Value(1)).current;

  const upcomingEvent = mockEvents.find(e => e.isRegistered);

  useEffect(() => {
    // Wave animation
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(waveAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(waveAnim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Quote rotation
    const quoteInterval = setInterval(() => {
      RNAnimated.sequence([
        RNAnimated.timing(quoteOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        RNAnimated.timing(quoteOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, []);

  const waveTranslate = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const openSocialMedia = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Background */}
      <LinearGradient
        colors={isDarkMode 
          ? ['#0F1419', '#1A1F2E', '#0F1419']
          : ['#E8F0FE', '#F0F7FF', '#FFFFFF']
        }
        style={StyleSheet.absoluteFillObject}
      />

      {/* Animated Wave Overlay */}
      <RNAnimated.View
        style={[
          styles.waveOverlay,
          {
            transform: [{ translateY: waveTranslate }],
            opacity: 0.3,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primary + '40', colors.accent + '40', colors.primary + '40']}
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
          {/* Personal Greeting */}
          <Animated.View entering={FadeInUp.duration(800)} style={styles.greetingSection}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Welcome back, {user?.name?.split(' ')[0] || 'Member'} 👋
            </Text>
            <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
              Ready to make an impact today?
            </Text>
          </Animated.View>

          {/* Floating Quote */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <BlurView intensity={isDarkMode ? 20 : 80} style={styles.quoteContainer}>
              <RNAnimated.View style={{ opacity: quoteOpacity }}>
                <Text style={[styles.quote, { color: colors.primary }]}>
                  "{QUOTES[currentQuoteIndex]}"
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
            </BlurView>
          </Animated.View>

          {/* Upcoming Event */}
          {upcomingEvent && (
            <Animated.View entering={FadeInDown.delay(400).springify()}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('EventDetail', { event: upcomingEvent })}
              >
                <BlurView intensity={isDarkMode ? 20 : 80} style={styles.eventCard}>
                  <LinearGradient
                    colors={[colors.primary + '20', colors.accent + '20']}
                    style={styles.eventGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.eventHeader}>
                      <View style={[styles.eventIconContainer, { backgroundColor: colors.primary }]}>
                        <MaterialIcons name="event" size={24} color="#FFFFFF" />
                      </View>
                      <View style={styles.eventHeaderText}>
                        <Text style={[styles.eventLabel, { color: colors.textLight }]}>
                          Next Event
                        </Text>
                        <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>
                          {upcomingEvent.title}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.eventDetails}>
                      <View style={styles.eventDetailRow}>
                        <MaterialIcons name="calendar-today" size={16} color={colors.textSecondary} />
                        <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                          {upcomingEvent.date}
                        </Text>
                      </View>
                      <View style={styles.eventDetailRow}>
                        <MaterialIcons name="access-time" size={16} color={colors.textSecondary} />
                        <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                          {upcomingEvent.time}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Notifications Strip */}
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <BlurView intensity={isDarkMode ? 20 : 80} style={styles.notificationStrip}>
              <View style={[styles.notificationDot, { backgroundColor: colors.secondary }]} />
              <Text style={[styles.notificationText, { color: colors.text }]}>
                1 new announcement
              </Text>
              <MaterialIcons name="chevron-right" size={20} color={colors.textLight} />
            </BlurView>
          </Animated.View>

          {/* Quick Actions */}
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
                style={[styles.socialButton, { backgroundColor: colors.surface }]}
                onPress={() => openSocialMedia('https://www.instagram.com/fbla_pbl/')}
                activeOpacity={0.7}
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
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: colors.surface }]}
                onPress={() => openSocialMedia('https://twitter.com/FBLA_PBL')}
                activeOpacity={0.7}
              >
                <View style={[styles.socialIconGradient, { backgroundColor: '#1DA1F2' }]}>
                  <MaterialIcons name="tag" size={24} color="#FFFFFF" />
                </View>
                <Text style={[styles.socialLabel, { color: colors.text }]}>Twitter/X</Text>
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
      <BlurView intensity={isDarkMode ? 20 : 80} style={styles.quickActionBlur}>
        <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
          <MaterialIcons name={icon} size={28} color={color} />
        </View>
        <Text style={[styles.quickActionLabel, { color: colors.text }]}>{label}</Text>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  waveOverlay: {
    position: 'absolute',
    top: 0,
    left: -50,
    right: -50,
    height: height * 0.6,
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
  },
  greetingSection: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  greeting: {
    ...TYPOGRAPHY.h1,
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  subGreeting: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
  },
  quoteContainer: {
    borderRadius: 24,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    alignItems: 'center',
  },
  quote: {
    ...TYPOGRAPHY.h3,
    fontSize: 22,
    textAlign: 'center',
    fontStyle: 'italic',
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
    borderRadius: 24,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  eventHeaderText: {
    flex: 1,
  },
  eventLabel: {
    ...TYPOGRAPHY.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  eventTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
  },
  eventDetails: {
    gap: SPACING.sm,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  eventDetailText: {
    ...TYPOGRAPHY.bodySmall,
  },
  notificationStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  notificationText: {
    ...TYPOGRAPHY.bodySmall,
    flex: 1,
  },
  quickActionsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
    paddingLeft: SPACING.xs,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  quickActionButton: {
    flex: 1,
  },
  quickActionBlur: {
    borderRadius: 20,
    padding: SPACING.md,
    alignItems: 'center',
    overflow: 'hidden',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
    borderRadius: 20,
    padding: SPACING.md,
    alignItems: 'center',
  },
  socialIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  socialLabel: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
});