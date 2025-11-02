import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <MaterialIcons 
              name={isEditing ? 'check' : 'edit'} 
              size={20} 
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
            style={[styles.profileHeader, { backgroundColor: colors.surfaceGlass }]}
          >
            <View style={styles.avatarContainer}>
              <View style={[styles.avatarCircle, { backgroundColor: colors.primary + '20' }]}>
                <MaterialIcons name="person" size={48} color={colors.primary} />
              </View>
            </View>
            <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
            <Text style={[styles.profilePosition, { color: colors.textSecondary }]}>{profile.position}</Text>
            <View style={[styles.chapterBadge, { backgroundColor: colors.primary + '15' }]}>
              <MaterialIcons name="school" size={14} color={colors.primary} />
              <Text style={[styles.chapterText, { color: colors.primary }]}>{profile.chapter}</Text>
            </View>
          </Animated.View>

          {/* Profile Information */}
          <Animated.View 
            entering={FadeInDown.delay(200).springify()} 
            style={[styles.infoCard, { backgroundColor: colors.surfaceGlass }]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Information</Text>
            
            <InfoField icon="email" label="Email" value={profile.email} editable colors={colors} isEditing={isEditing} profile={profile} setProfile={setProfile} />
            <InfoField icon="phone" label="Phone" value={profile.phone} editable colors={colors} isEditing={isEditing} profile={profile} setProfile={setProfile} />
            <InfoField icon="calendar-today" label="Member Since" value={profile.memberSince} colors={colors} isEditing={false} profile={profile} setProfile={setProfile} />
            <InfoField icon="info" label="Bio" value={profile.bio} editable multiline colors={colors} isEditing={isEditing} profile={profile} setProfile={setProfile} />
          </Animated.View>

          {/* Settings */}
          <Animated.View 
            entering={FadeInDown.delay(300).springify()} 
            style={[styles.settingsCard, { backgroundColor: colors.surfaceGlass }]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
            
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={toggleTheme}>
              <View style={styles.settingLeft}>
                <MaterialIcons name={isDarkMode ? 'dark-mode' : 'light-mode'} size={22} color={colors.textSecondary} />
                <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <View style={[styles.toggle, { backgroundColor: isDarkMode ? colors.primary : colors.border }]}>
                <View style={[styles.toggleThumb, { transform: [{ translateX: isDarkMode ? 20 : 0 }] }]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.logoutItem]} onPress={handleSignOut}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="logout" size={22} color={colors.error} />
                <Text style={[styles.settingText, { color: colors.error }]}>Sign Out</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

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
        <MaterialIcons name={icon} size={18} color={colors.primary} />
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      </View>
      {isEditing && editable ? (
        <TextInput
          style={[
            styles.fieldInput, 
            { color: colors.text, backgroundColor: colors.background + '40', borderColor: colors.border },
            multiline && styles.fieldInputMultiline
          ]}
          value={value}
          onChangeText={(text) => setProfile({ ...profile, [label.toLowerCase()]: text })}
          multiline={multiline}
          placeholderTextColor={colors.textLight}
        />
      ) : (
        <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
      )}
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
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    fontSize: 28,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 120,
  },
  profileHeader: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  profilePosition: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.md,
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
    fontWeight: '500',
  },
  infoCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    gap: SPACING.xs,
  },
  fieldLabel: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
  },
  fieldValue: {
    ...TYPOGRAPHY.body,
    marginLeft: 26,
  },
  fieldInput: {
    ...TYPOGRAPHY.body,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginLeft: 26,
    borderWidth: 1,
  },
  fieldInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  settingsCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    gap: SPACING.md,
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
});
