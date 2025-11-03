import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import NewsCard from '../components/NewsCard';
import { mockNews } from '../data/mockData';
import { NewsItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

export default function NewsFeedScreen() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(mockNews);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { colors, isDarkMode } = useTheme();

  const categories = [
    { id: 'all', label: 'All', icon: 'apps' as const },
    { id: 'announcement', label: 'Announcements', icon: 'campaign' as const },
    { id: 'achievement', label: 'Achievements', icon: 'emoji-events' as const },
    { id: 'reminder', label: 'Reminders', icon: 'notifications' as const },
    { id: 'update', label: 'Updates', icon: 'update' as const },
  ];

  const handleLike = (id: string) => {
    setNewsItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likes: item.isLiked ? item.likes - 1 : item.likes + 1,
        };
      }
      return item;
    }));
  };

  const filteredNews = selectedCategory === 'all'
    ? newsItems
    : newsItems.filter(item => item.category === selectedCategory);

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
            <Text style={[styles.headerTitle, { color: colors.text }]}>News Feed</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Stay updated with latest news
            </Text>
          </View>
          <TouchableOpacity style={styles.searchButtonContainer}>
            <BlurView intensity={isDarkMode ? 30 : 90} style={styles.searchButtonBlur}>
              <View style={styles.searchButton}>
                <MaterialIcons name="search" size={24} color={colors.text} />
              </View>
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
                        colors={[colors.primary, colors.primaryLight]}
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

        {/* News Feed */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedContainer}
        >
          {filteredNews.map((news, index) => (
            <NewsCard
              key={news.id}
              news={news}
              onLike={() => handleLike(news.id)}
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
  searchButtonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  searchButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  searchButton: {
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
  feedContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: 120,
  },
});