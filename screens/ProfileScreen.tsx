import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export default function ProfileScreen() {
  const { user, signOut, updateProfile } = useAuth();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const handleSave = async () => {
    await updateProfile(formData);
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

  const openSocialMedia = (url: string) => {
    Linking.openURL(url);
  };

  const InfoField = ({ 
    icon, 
    label, 
    value, 
    editable = false,
    multiline = false,
    field,
  }: { 
    icon: keyof typeof MaterialIcons.glyphMap; 
    label: string; 
    value: string;
    editable?: boolean;
    multiline?: boolean;
    field?: string;
  }) => (
    <View style={styles.infoField}>
      <View style={styles.fieldHeader}>
        <MaterialIcons name={icon} size={20} color={colors.primary} />
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      </View>
      {isEditing && editable && field ? (
        <TextInput
          style={[
            styles.fieldInput, 
            { 
              color: colors.text, 
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
            multiline && styles.fieldInputMultiline
          ]}
          value={value}
          onChangeText={(text) => setFormData({ ...formData, [field]: text })}
          multiline={multiline}
          placeholderTextColor={colors.textLight}
        />
      ) : (
        <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <MaterialIcons 
            name={isEditing ? 'check' : 'edit'} 
            size={24} 
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile Header */}
        <Animated.View 
          entering={FadeIn.duration(600)} 
          style={[styles.profileHeader, { backgroundColor: colors.surface }, SHADOWS.medium]}
        >
          <View style={styles.avatarContainer}>
            <MaterialIcons name="account-circle" size={80} color={colors.primary} />
            {isEditing && (
              <TouchableOpacity style={[styles.avatarEditButton, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="camera-alt" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>{user?.name}</Text>
          <Text style={[styles.profilePosition, { color: colors.textSecondary }]}>{user?.position}</Text>
          <View style={[styles.chapterBadge, { backgroundColor: colors.primary + '20' }]}>
            <MaterialIcons name="school" size={16} color={colors.primary} />
            <Text style={[styles.chapterText, { color: colors.primary }]}>{user?.chapter}</Text>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()} 
          style={[styles.statsCard, { backgroundColor: colors.surface }, SHADOWS.medium]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{user?.eventsAttended || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Events Attended</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {user?.memberSince ? Math.floor((Date.now() - new Date(user.memberSince).getTime()) / (1000 * 60 * 60 * 24)) : 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days as Member</Text>
          </View>
        </Animated.View>

        {/* Profile Information */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()} 
          style={[styles.infoCard, { backgroundColor: colors.surface }, SHADOWS.medium]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
          
          <InfoField icon="person" label="Name" value={formData.name} editable field="name" />
          <InfoField icon="email" label="Email" value={formData.email} editable field="email" />
          <InfoField icon="phone" label="Phone" value={formData.phone} editable field="phone" />
          <InfoField icon="calendar-today" label="Member Since" value={user?.memberSince || 'N/A'} />
          <InfoField icon="info" label="Bio" value={formData.bio} editable multiline field="bio" />
        </Animated.View>

        {/* Social Media */}
        <Animated.View 
          entering={FadeInDown.delay(350).springify()} 
          style={[styles.socialCard, { backgroundColor: colors.surface }, SHADOWS.medium]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Connect with FBLA</Text>
          
          <TouchableOpacity 
            style={[styles.socialItem, { borderBottomColor: colors.divider }]}
            onPress={() => openSocialMedia('https://www.instagram.com/fbla_pbl/')}
          >
            <View style={styles.socialLeft}>
              <View style={[styles.socialIconContainer, { backgroundColor: '#E1306C20' }]}>
                <MaterialIcons name="camera-alt" size={24} color="#E1306C" />
              </View>
              <Text style={[styles.socialText, { color: colors.text }]}>Instagram</Text>
            </View>
            <MaterialIcons name="open-in-new" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.socialItem, { borderBottomWidth: 0 }]}
            onPress={() => openSocialMedia('https://twitter.com/FBLA_PBL')}
          >
            <View style={styles.socialLeft}>
              <View style={[styles.socialIconContainer, { backgroundColor: '#1DA1F220' }]}>
                <MaterialIcons name="tag" size={24} color="#1DA1F2" />
              </View>
              <Text style={[styles.socialText, { color: colors.text }]}>Twitter/X</Text>
            </View>
            <MaterialIcons name="open-in-new" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </Animated.View>

        {/* Settings */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()} 
          style={[styles.settingsCard, { backgroundColor: colors.surface }, SHADOWS.medium]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.divider }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name={isDarkMode ? 'dark-mode' : 'light-mode'} size={24} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.divider }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="notifications" size={24} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.divider }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="lock" size={24} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Privacy</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.divider }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="help" size={24} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, styles.logoutItem]}
            onPress={handleSignOut}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="logout" size={24} color={colors.error} />
              <Text style={[styles.settingText, { color: colors.error }]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  profileHeader: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  chapterText: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  statsCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
  infoCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  socialCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
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
  fieldLabel: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  fieldValue: {
    ...TYPOGRAPHY.body,
    marginLeft: 28,
  },
  fieldInput: {
    ...TYPOGRAPHY.body,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginLeft: 28,
    borderWidth: 1,
  },
  fieldInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  socialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  socialText: {
    ...TYPOGRAPHY.body,
  },
  settingsCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
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
  settingText: {
    ...TYPOGRAPHY.body,
    marginLeft: SPACING.md,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
});