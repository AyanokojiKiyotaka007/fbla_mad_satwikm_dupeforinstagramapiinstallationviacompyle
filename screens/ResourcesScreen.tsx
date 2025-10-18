import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import ResourceCard from '../components/ResourceCard';
import { mockResources } from '../data/mockData';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

export default function ResourcesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'guide', label: 'Guides' },
    { id: 'template', label: 'Templates' },
    { id: 'presentation', label: 'Presentations' },
    { id: 'document', label: 'Documents' },
  ];

  const handleDownload = (resourceTitle: string) => {
    Alert.alert(
      'Download Started',
      `Downloading "${resourceTitle}"...`,
      [{ text: 'OK' }]
    );
  };

  const filteredResources = selectedCategory === 'all'
    ? mockResources
    : mockResources.filter(r => r.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resources</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <MaterialIcons name="cloud-upload" size={24} color={COLORS.surface} />
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
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
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
        <Text style={styles.resultsText}>
          {filteredResources.length} {filteredResources.length === 1 ? 'file' : 'files'} available
        </Text>

        {filteredResources.map((resource, index) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onDownload={() => handleDownload(resource.title)}
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  uploadButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    marginBottom: SPACING.md,
  },
  categoryContent: {
    paddingHorizontal: SPACING.md,
  },
  categoryChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.accent,
  },
  categoryText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: COLORS.surface,
  },
  resourcesContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  resultsText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
});