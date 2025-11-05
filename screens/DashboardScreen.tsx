import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated as RNAnimated, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
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
  const waveAnim = useRef(new RNAnimated.Value(0)).current;
  const quoteOpacity = useRef(new RNAnimated.Value(1)).current;

  const upcomingEvent = mockEvents.find(e => e.isRegistered);

  useEffect(() => {
    const dateInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

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

    return () => {
      clearInterval(dateInterval);
      clearInterval(quoteInterval);
    };
  }, [waveAnim, quoteOpacity]);

  const waveTranslate = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const openSocialMedia = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = currentDate.getDate();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });
  const year = currentDate.getFullYear();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Full-screen refined gradient - fills entire viewport */}
      <LinearGradient
        colors={isDarkMode 
          ? ['#0A0E1A', '#1A1F2E', '#0F1419', '#0A0E1A']
          : ['#E6EFFD', '#EEF4FF', '#F8FBFF', '#FFFFFF']
        }
        style={[StyleSheet.absoluteFillObject, { width: '100%', height: '100%' }]}
        locations={[0, 0.35, 0.65, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Animated Wave Overlay with shimmer */}
      <RNAnimated.View
        style={[
          styles.waveOverlay,
          {
            transform: [{ translateY: waveTranslate }],
            opacity: isDarkMode ? 0.15 : 0.12,
          },
        ]}
      >
        <LinearGradient
          colors={isDarkMode 
            ? [colors.primary + '20', colors.accent + '25', colors.primary + '20']
            : [colors.primary + '15', colors.accent + '18', colors.primary + '15']
          }
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
          {/* Personal Greeting with Date */}
          <Animated.View entering={FadeInUp.duration(800)} style={styles.greetingSection}>
            <View style={styles.greetingRow}>
              <View style={styles.greetingTextContainer}>
                <Text style={[styles.greeting, { color: colors.text }]}>
                  Welcome back, {user?.name?.split(' ')[0] || 'Member'}
                </Text>
                <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
                  Ready to make an impact today?
                </Text>
              </View>
              
              {/* Enhanced Calendar Card with edge glow */}
              <Animated.View entering={FadeIn.delay(300).springify()}>
                <BlurView intensity={isDarkMode ? 25 : 80} style={[styles.dateCard, SHADOWS.medium]}>
                  <LinearGradient
                    colors={isDarkMode 
                      ? [colors.primary + '25', colors.primary + '15']
                      : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']
                    }
                    style={styles.dateCardGradient}
                  >
                    {/* Edge reflection */}
                    <LinearGradient
                      colors={isDarkMode 
                        ? ['rgba(90, 159, 238, 0.1)', 'transparent']
                        : ['rgba(255, 255, 255, 0.98)', 'transparent']
                      }
                      style={styles.edgeReflection}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                    <View style={[styles.dateCardInner, { 
                      borderColor: isDarkMode ? colors.glassBorder : 'rgba(255, 255, 255, 0.9)', 
                      borderWidth: 2,
                      backgroundColor: isDarkMode ? 'transparent' : 'rgba(0, 61, 165, 0.03)'
                    }]}>
                      <Text style={[styles.dateDay, { color: colors.primary }]}>{dayName}</Text>
                      <Text style={[styles.dateNumber, { color: colors.text }]}>{dayNumber}</Text>
                      <Text style={[styles.dateMonth, { color: colors.textSecondary }]}>{monthName}</Text>
                      <Text style={[styles.dateYear, { color: colors.textLight }]}>{year}</Text>
                    </View>
                  </LinearGradient>
                </BlurView>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Enhanced Quote Card with luminous edges */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <BlurView intensity={isDarkMode ? 25 : 85} style={[styles.quoteContainer, SHADOWS.medium]}>
              <LinearGradient
                colors={isDarkMode 
                  ? ['rgba(26, 31, 46, 0.4)', 'rgba(37, 42, 53, 0.3)']
                  : ['rgba(255, 255, 255, 0.88)', 'rgba(255, 255, 255, 0.72)']
                }
                style={styles.quoteGradient}
              >
                {/* Edge glow */}
                <LinearGradient
                  colors={isDarkMode 
                    ? ['rgba(90, 159, 238, 0.08)', 'transparent', 'rgba(90, 159, 238, 0.08)']
                    : ['rgba(255, 255, 255, 0.95)', 'transparent', 'rgba(255, 255, 255, 0.95)']
                  }
                  style={styles.cardEdgeGlow}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <View style={[styles.quoteInner, { 
                  borderColor: isDarkMode ? colors.glassBorder : 'rgba(255, 255, 255, 0.85)', 
                  borderWidth: 2 
                }]}>
                  <RNAnimated.View style={{ opacity: quoteOpacity }}>
                    <Text style={[styles.quote, { color: colors.primary }]}>
                      &ldquo;{QUOTES[currentQuoteIndex]}&rdquo;
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
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Enhanced Upcoming Event with defined glass */}
          {upcomingEvent && (
            <Animated.View entering={FadeInDown.delay(400).springify()}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('EventDetail', { event: upcomingEvent })}
              >
                <BlurView intensity={isDarkMode ? 30 : 85} style={[styles.eventCard, SHADOWS.large]}>
                  <LinearGradient
                    colors={isDarkMode 
                      ? ['rgba(26, 31, 46, 0.5)', 'rgba(37, 42, 53, 0.4)']
                      : ['rgba(255, 255, 255, 0.90)', 'rgba(255, 255, 255, 0.75)']
                    }
                    style={styles.eventGradient}
                  >
                    {/* Curved edge reflection */}
                    <LinearGradient
                      colors={isDarkMode 
                        ? ['rgba(90, 159, 238, 0.1)', 'transparent']
                        : ['rgba(255, 255, 255, 0.98)', 'transparent']
                      }
                      style={styles.curvedReflection}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0.5, y: 0.5 }}
                    />
                    <View style={[styles.eventCardInner, { 
                      borderColor: isDarkMode ? colors.glassBorder : 'rgba(255, 255, 255, 0.9)', 
                      borderWidth: 2 
                    }]}>
                      <View style={styles.eventHeader}>
                        <View style={[styles.eventIconContainer, { backgroundColor: colors.primary }]}>
                          <MaterialIcons name="event" size={24} color="#FFFFFF" />
                        </View>
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
                    </View>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Enhanced Notifications Strip */}
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('NewsFeed')}
            >
              <BlurView intensity={isDarkMode ? 25 : 85} style={[styles.notificationStrip, SHADOWS.small]}>
                <LinearGradient
                  colors={isDarkMode 
                    ? ['rgba(26, 31, 46, 0.4)', 'rgba(37, 42, 53, 0.3)']
                    : ['rgba(255, 255, 255, 0.88)', 'rgba(255, 255, 255, 0.72)']
                  }
                  style={styles.notificationGradient}
                >
                  <View style={[styles.notificationInner, { 
                    borderColor: isDarkMode ? colors.glassBorder : 'rgba(255, 255, 255, 0.85)', 
                    borderWidth: 2 
                  }]}>
                    <View style={[styles.notificationDot, { backgroundColor: colors.secondary }]} />
                    <Text style={[styles.notificationText, { color: colors.text }]}>
                      1 new announcement
                    </Text>
                    <MaterialIcons name="chevron-right" size={20} color={colors.textLight} />
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* Quick Actions - Centered Header */}
          <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.quickActionsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <QuickActionButton
                icon="event"
                color={colors.primary}
                onPress={() => navigation.navigate('Calendar')}
                colors={colors}
                isDarkMode={isDarkMode}
              />
              <QuickActionButton
                icon="article"
                color={colors.secondary}
                onPress={() => navigation.navigate('NewsFeed')}
                colors={colors}
                isDarkMode={isDarkMode}
              />
              <QuickActionButton
                icon="folder"
                color={colors.accent}
                onPress={() => navigation.navigate('Resources')}
                colors={colors}
                isDarkMode={isDarkMode}
              />
            </View>
          </Animated.View>

          {/* Social Media Section - Centered Header with Perfect Alignment */}
          <Animated.View entering={FadeInDown.delay(1000).springify()} style={styles.socialSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Connect With Us</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                onPress={() => openSocialMedia('https://www.instagram.com/fbla_pbl/')}
                activeOpacity={0.85}
                style={styles.socialButtonWrapper}
              >
                <BlurView intensity={isDarkMode ? 25 : 85} style={[styles.socialButton, SHADOWS.medium]}>
                  <LinearGradient
                    colors={isDarkMode 
                      ? ['rgba(26, 31, 46, 0.4)', 'rgba(37, 42, 53, 0.3)']
                      : ['rgba(255, 255, 255, 0.88)', 'rgba(255, 255, 255, 0.72)']
                    }
                    style={styles.socialGradient}
                  >
                    <View style={[styles.socialButtonInner, { 
                      borderColor: isDarkMode ? colors.glassBorder : 'rgba(255, 255, 255, 0.85)', 
                      borderWidth: 2 
                    }]}>
                      <LinearGradient
                        colors={['#833AB4', '#FD1D1D', '#F77737']}
                        style={styles.socialIconGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <MaterialIcons name="camera-alt" size={24} color="#FFFFFF" />
                      </LinearGradient>
                      <Text style={[styles.socialLabel, { color: colors.text }]}>Instagram</Text>
                    </View>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openSocialMedia('https://twitter.com/FBLA_PBL')}
                activeOpacity={0.85}
                style={styles.socialButtonWrapper}
              >
                <BlurView intensity={isDarkMode ? 25 : 85} style={[styles.socialButton, SHADOWS.medium]}>
                  <LinearGradient
                    colors={isDarkMode 
                      ? ['rgba(26, 31, 46, 0.4)', 'rgba(37, 42, 53, 0.3)']
                      : ['rgba(255, 255, 255, 0.88)', 'rgba(255, 255, 255, 0.72)']
                    }
                    style={styles.socialGradient}
                  >
                    <View style={[styles.socialButtonInner, { 
                      borderColor: isDarkMode ? colors.glassBorder : 'rgba(255, 255, 255, 0.85)', 
                      borderWidth: 2 
                    }]}>
                      <View style={[styles.socialIconGradient, { backgroundColor: '#1DA1F2' }]}>
                        <MaterialIcons name="tag" size={24} color="#FFFFFF" />
                      </View>
                      <Text style={[styles.socialLabel, { color: colors.text }]}>Twitter/X</Text>
                    </View>
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

function QuickActionButton({ icon, color, onPress, colors, isDarkMode }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.quickActionButton}>
      <BlurView intensity={isDarkMode ? 25 : 85} style={[styles.quickActionBlur, SHADOWS.medium]}>
        <LinearGradient
          colors={isDarkMode 
            ? ['rgba(26, 31, 46, 0.4)', 'rgba(37, 42, 53, 0.3)']
            : ['rgba(255, 255, 255, 0.88)', 'rgba(255, 255, 255, 0.72)']
          }
          style={styles.quickActionGradient}
        >
          {/* Edge glow for curved corners */}
          <LinearGradient
            colors={isDarkMode 
              ? ['rgba(90, 159, 238, 0.08)', 'transparent']
              : ['rgba(255, 255, 255, 0.95)', 'transparent']
            }
            style={styles.buttonEdgeGlow}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={[styles.quickActionInner, { 
            borderColor: isDarkMode ? colors.glassBorder : 'rgba(255, 255, 255, 0.85)', 
            borderWidth: 2 
          }]}>
            <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
              <MaterialIcons name={icon} size={32} color={color} />
            </View>
          </View>
        </LinearGradient>
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
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingTextContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  greeting: {
    ...TYPOGRAPHY.h1,
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  subGreeting: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 16,
  },
  dateCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  dateCardGradient: {
    borderRadius: 20,
  },
  edgeReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dateCardInner: {
    padding: SPACING.md,
    width: 78,
    alignItems: 'center',
  },
  dateDay: {
    ...TYPOGRAPHY.captionBold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  dateNumber: {
    ...TYPOGRAPHY.h1,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
  },
  dateMonth: {
    ...TYPOGRAPHY.captionBold,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  dateYear: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '500',
  },
  quoteContainer: {
    borderRadius: 22,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  quoteGradient: {
    borderRadius: 22,
  },
  cardEdgeGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
  },
  quoteInner: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  quote: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
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
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  eventGradient: {
    borderRadius: 26,
  },
  curvedReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: '60%',
    borderTopLeftRadius: 26,
  },
  eventCardInner: {
    padding: SPACING.lg,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  eventIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
    fontWeight: '500',
  },
  notificationStrip: {
    borderRadius: 20,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  notificationGradient: {
    borderRadius: 20,
  },
  notificationInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
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
    fontWeight: '500',
  },
  quickActionsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  quickActionButton: {
    width: 88,
    height: 88,
  },
  quickActionBlur: {
    borderRadius: 24,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  quickActionGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  buttonEdgeGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '50%',
    borderTopLeftRadius: 24,
  },
  quickActionInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialSection: {
    marginBottom: SPACING.lg,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  socialButtonWrapper: {
    flex: 1,
  },
  socialButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  socialGradient: {
    borderRadius: 24,
  },
  socialButtonInner: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  socialIconGradient: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  socialLabel: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
});