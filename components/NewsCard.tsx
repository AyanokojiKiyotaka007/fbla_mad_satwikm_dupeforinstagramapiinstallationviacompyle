import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { NewsItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

interface NewsCardProps {
  news: NewsItem;
  onLike: () => void;
  index: number;
}

const categoryIcons = {
  announcement: 'campaign' as const,
  achievement: 'emoji-events' as const,
  reminder: 'notifications' as const,
  update: 'update' as const,
};

export default function NewsCard({ news, onLike, index }: NewsCardProps) {
  const { colors } = useTheme();
  
  const categoryColors = {
    announcement: colors.primary,
    achievement: colors.success,
    reminder: colors.warning,
    update: colors.info,
  };
  
  const categoryColor = categoryColors[news.category];
  const categoryIcon = categoryIcons[news.category];

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
      <View style={[styles.container, { backgroundColor: colors.surface }, SHADOWS.medium]}>
        <View style={styles.header}>
          <View style={[styles.categoryIcon, { backgroundColor: categoryColor + '20' }]}>
            <MaterialIcons name={categoryIcon} size={20} color={categoryColor} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{news.title}</Text>
            <Text style={[styles.meta, { color: colors.textLight }]}>
              {news.author} • {news.date}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.content, { color: colors.textSecondary }]} numberOfLines={3}>{news.content}</Text>
        
        <View style={[styles.footer, { borderTopColor: colors.divider }]}>
          <TouchableOpacity 
            style={styles.likeButton} 
            onPress={onLike}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name={news.isLiked ? 'favorite' : 'favorite-border'} 
              size={20} 
              color={news.isLiked ? colors.error : colors.textLight} 
            />
            <Text style={[styles.likeText, { color: news.isLiked ? colors.error : colors.textLight }]}>
              {news.likes}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton}>
            <MaterialIcons name="share" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
    marginBottom: SPACING.xs,
  },
  meta: {
    ...TYPOGRAPHY.caption,
  },
  content: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  likeText: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.xs,
  },
  shareButton: {
    padding: SPACING.xs,
  },
});
