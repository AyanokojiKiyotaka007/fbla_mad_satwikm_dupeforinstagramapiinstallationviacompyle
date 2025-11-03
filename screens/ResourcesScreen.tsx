import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import ResourceCard from '../components/ResourceCard';
import { mockResources } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

export default function ResourcesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { colors, isDarkMode } = useTheme();

  const categories = [
    { id: 'all', label: 'All Files', icon: 'folder' as const },
    { id: 'guide', label: 'Guides', icon: 'menu-book' as const },
    { id: 'template', label: 'Templates', icon: 'description' as const },
    { id: 'presentation', label: 'Presentations', icon: 'slideshow' as const },
    { id: 'document', label: 'Documents', icon: 'article' as const },
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
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Resources</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {filteredResources.length} files available
            </Text>
          </View>
          <TouchableOpacity style={styles.uploadButtonContainer}>
            <BlurView intensity={isDarkMode ? 30 : 90} style={styles.uploadButtonBlur}>
              <LinearGradient
                colors={[colors.accent, colors.accent + 'DD']}
                style={styles.uploadButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name="cloud-upload" size={24} color="#FFFFFF" />
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Category Filter */}
        <Animated.View entering={FadeIn.delay(200).duration(600)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
            contentContainerStyle={styles.categoryContent}
          >
            {categories.map((category, index) => (
              <Animated.View key={category.id} entering={FadeInDown.delay(300 + index * 50).springify()}>
                <TouchableOpacity
                  style={styles.categoryChipContainer}
                  onPress={() => setSelectedCategory(category.id)}
                  activeOpacity={0.8}
                >
                  <BlurView 
                    intensity={isDarkMode ? 30 : 90} 
                    style={[
                      styles.categoryChip,
                      selectedCategory === category.id && styles.categoryChipActive
                    ]}
                  >
                    {selectedCategory === category.id && (
                      <LinearGradient
                        colors={[colors.accent, colors.accent + 'DD']}
                        style={StyleSheet.absoluteFillObject}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                    )}
                    <MaterialIcons 
                      name={category.icon} 
                      size={16} 
                      color={selectedCategory === category.id ? '#FFFFFF' : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.categoryText,
                      { color: selectedCategory === category.id ? '#FFFFFF' : colors.textSecondary },
                    ]}>
                      {category.label}
                    </Text>
                  </BlurView>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Resources List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resourcesContainer}
        >
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
  headerSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    marginTop: SPACING.xs,
  },
  uploadButtonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  uploadButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  uploadButton: {
    width: 48,
    height: 48,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    marginBottom: SPACING.md,
  },
  categoryContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryChipContainer: {
    marginRight: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  categoryChipActive: {
    borderColor: 'transparent',
  },
  categoryText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  resourcesContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: 120,
  },
});