import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
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
    { id: 'all', label: 'All' },
    { id: 'announcement', label: 'Announcements' },
    { id: 'achievement', label: 'Achievements' },
    { id: 'reminder', label: 'Reminders' },
    { id: 'update', label: 'Updates' },
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Announcements</Text>
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
                  { 
                    backgroundColor: selectedCategory === category.id ? colors.primary : colors.surfaceGlass,
                    borderColor: selectedCategory === category.id ? colors.primary : 'rgba(255, 255, 255, 0.2)',
                  },
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.8}
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
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    fontSize: 28,
  },
  categoryContainer: {
    marginBottom: SPACING.lg,
  },
  categoryContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    borderWidth: 1,
  },
  categoryText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
  },
  feedContainer: {
    paddingTop: SPACING.sm,
    paddingBottom: 120,
  },
});
