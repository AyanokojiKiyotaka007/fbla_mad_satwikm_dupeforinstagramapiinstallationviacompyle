import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import ResourceCard from '../components/ResourceCard';
import { mockResources } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

export default function ResourcesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { colors, isDarkMode } = useTheme();

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'guide', label: 'Guides' },
    { id: 'template', label: 'Templates' },
    { id: 'presentation', label: 'Presentations' },
    { id: 'document', label: 'Documents' },
  ];

  const handleDownload = (resource: any) => {
    if (resource.url) {
      Linking.openURL(resource.url).catch(err => console.error('Error opening URL:', err));
    }
  };

  const filteredResources = selectedCategory === 'all'
    ? mockResources
    : mockResources.filter(r => r.category === selectedCategory);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Full-screen gradient background */}
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
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Resources</Text>
        <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colors.accent }]}>
          <MaterialIcons name="cloud-upload" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <Animated.View entering={FadeIn.duration(600)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                { backgroundColor: selectedCategory === category.id ? colors.accent : colors.surface },
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === category.id ? '#FFFFFF' : colors.textSecondary },
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Resources List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resourcesContainer}
      >
        <Text style={[styles.resultsText, { color: colors.textLight }]}>
          {filteredResources.length} {filteredResources.length === 1 ? 'file' : 'files'} available
        </Text>

        {filteredResources.map((resource, index) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onDownload={() => handleDownload(resource)}
            index={index}
          />
        ))}
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
  uploadButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    marginBottom: SPACING.md,
  },
  categoryContent: {
    paddingHorizontal: SPACING.lg,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  categoryText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  resourcesContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: 100,
  },
  resultsText: {
    ...TYPOGRAPHY.bodySmall,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
});
