import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(user || {
    name: '',
    email: '',
    chapter: '',
    position: '',
    phone: '',
    bio: '',
    memberSince: '',
  });

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  function InfoField({ 
    icon, 
    label, 
    value, 
    editable = false,
    multiline = false,
    colors,
    isEditing,
    profile,
    setProfile,
  }: any) {
    return (
      <View style={styles.infoField}>
        <View style={styles.fieldHeader}>
          <View style={[styles.fieldIcon, { backgroundColor: colors.primary + '15' }]}>
            <MaterialIcons name={icon} size={18} color={colors.primary} />
          </View>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
        </View>
        {isEditing && editable ? (
          <TextInput
            style={[
              styles.fieldInput, 
              { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              multiline && styles.fieldInputMultiline
            ]}
            value={value}
            onChangeText={(text) => setProfile({ ...profile, [label.toLowerCase()]: text })}
            multiline={multiline}
          />
        ) : (
          <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
        )}
      </View>
    );
  }

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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity 
            style={styles.editButtonContainer}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <BlurView intensity={isDarkMode ? 30 : 90} style={styles.editButtonBlur}>
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.editButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons 
                  name={isEditing ? 'check' : 'edit'} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Profile Header */}
          <Animated.View entering={FadeIn.duration(600)} style={styles.profileHeaderContainer}>
            <BlurView intensity={isDarkMode ? 30 : 90} style={styles.profileHeaderBlur}>
              <LinearGradient
                colors={isDarkMode 
                  ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                  : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.6)']
                }
                style={styles.profileHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={[colors.primary, colors.primaryLight]}
                    style={styles.avatar}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name="account-circle" size={80} color="#FFFFFF" />
                  </LinearGradient>
                  {isEditing && (
                    <TouchableOpacity style={[styles.avatarEditButton, { backgroundColor: colors.primary }]}>
                      <MaterialIcons name="camera-alt" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
                <Text style={[styles.profilePosition, { color: colors.textSecondary }]}>{profile.position}</Text>
                <View style={[styles.chapterBadge, { backgroundColor: colors.primary + '20' }]}>
                  <MaterialIcons name="school" size={16} color={colors.primary} />
                  <Text style={[styles.chapterText, { color: colors.primary }]}>{profile.chapter}</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Stats */}
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsContainer}>
            <BlurView intensity={isDarkMode ? 30 : 90} style={styles.statsBlur}>
              <LinearGradient
                colors={isDarkMode 
                  ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                  : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.6)']
                }
                style={styles.statsCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={[colors.primary, colors.primaryLight]}
                    style={styles.statIconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name="event" size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={[styles.statValue, { color: colors.text }]}>24</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Events</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]} />
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={[colors.accent, colors.accent + 'DD']}
                    style={styles.statIconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name="calendar-today" size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {profile.memberSince ? Math.floor((Date.now() - new Date(profile.memberSince).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Profile Information */}
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.infoContainer}>
            <BlurView intensity={isDarkMode ? 30 : 90} style={styles.infoBlur}>
              <LinearGradient
                colors={isDarkMode 
                  ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                  : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.6)']
                }
                style={styles.infoCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
                
                <InfoField icon="email" label="Email" value={profile.email} editable colors={colors} isEditing={isEditing} profile={profile} setProfile={setProfile} />
                <InfoField icon="phone" label="Phone" value={profile.phone} editable colors={colors} isEditing={isEditing} profile={profile} setProfile={setProfile} />
                <InfoField icon="calendar-today" label="Member Since" value={profile.memberSince} colors={colors} isEditing={false} profile={profile} setProfile={setProfile} />
                <InfoField icon="info" label="Bio" value={profile.bio} editable multiline colors={colors} isEditing={isEditing} profile={profile} setProfile={setProfile} />
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Settings */}
          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.settingsContainer}>
            <BlurView intensity={isDarkMode ? 30 : 90} style={styles.settingsBlur}>
              <LinearGradient
                colors={isDarkMode 
                  ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                  : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.6)']
                }
                style={styles.settingsCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
                
                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]} onPress={toggleTheme}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: colors.primary + '15' }]}>
                      <MaterialIcons name={isDarkMode ? 'dark-mode' : 'light-mode'} size={20} color={colors.primary} />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
                  </View>
                  <View style={[styles.toggle, { backgroundColor: isDarkMode ? colors.primary : colors.border }]}>
                    <View style={[styles.toggleThumb, { transform: [{ translateX: isDarkMode ? 20 : 0 }] }]} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: colors.info + '15' }]}>
                      <MaterialIcons name="notifications" size={20} color={colors.info} />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: colors.warning + '15' }]}>
                      <MaterialIcons name="lock" size={20} color={colors.warning} />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>Privacy</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: colors.success + '15' }]}>
                      <MaterialIcons name="help" size={20} color={colors.success} />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, styles.logoutItem]} onPress={handleSignOut}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: colors.error + '15' }]}>
                      <MaterialIcons name="logout" size={20} color={colors.error} />
                    </View>
                    <Text style={[styles.settingText, styles.logoutText, { color: colors.error }]}>Log Out</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </BlurView>
          </Animated.View>
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
  editButtonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  editButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  editButton: {
    width: 48,
    height: 48,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
  },
  profileHeaderContainer: {
    marginBottom: SPACING.md,
  },
  profileHeaderBlur: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileHeader: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  profileName: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  profilePosition: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.sm,
  },
  chapterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  chapterText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  statsContainer: {
    marginBottom: SPACING.md,
  },
  statsBlur: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsCard: {
    padding: SPACING.lg,
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    marginHorizontal: SPACING.md,
  },
  infoContainer: {
    marginBottom: SPACING.md,
  },
  infoBlur: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoCard: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
  },
  infoField: {
    marginBottom: SPACING.md,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  fieldIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  fieldLabel: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  fieldValue: {
    ...TYPOGRAPHY.body,
    marginLeft: 40,
  },
  fieldInput: {
    ...TYPOGRAPHY.body,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginLeft: 40,
    borderWidth: 1,
  },
  fieldInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  settingsContainer: {
    marginBottom: SPACING.md,
  },
  settingsBlur: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingsCard: {
    padding: SPACING.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  settingText: {
    ...TYPOGRAPHY.body,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontWeight: '600',
  },
});