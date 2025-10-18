import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { NewsItem } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

interface NewsCardProps {
  news: NewsItem;
  onLike: () => void;
  index: number;
}

const categoryColors = {
  announcement: COLORS.primary,
  achievement: COLORS.success,
  reminder: COLORS.warning,
  update: COLORS.info,
};

const categoryIcons = {
  announcement: 'campaign' as const,
  achievement: 'emoji-events' as const,
  reminder: 'notifications' as const,
  update: 'update' as const,
};

export default function NewsCard({ news, onLike, index }: NewsCardProps) {
  const categoryColor = categoryColors[news.category];
  const categoryIcon = categoryIcons[news.category];

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
      <View style={[styles.container, SHADOWS.medium]}>
        <View style={styles.header}>
          <View style={[styles.categoryIcon, { backgroundColor: categoryColor + '20' }]}>
            <MaterialIcons name={categoryIcon} size={20} color={categoryColor} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={2}>{news.title}</Text>
            <Text style={styles.meta}>
              {news.author} • {news.date}
            </Text>
          </View>
        </View>
        
        <Text style={styles.content} numberOfLines={3}>{news.content}</Text>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.likeButton} 
            onPress={onLike}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name={news.isLiked ? 'favorite' : 'favorite-border'} 
              size={20} 
              color={news.isLiked ? COLORS.error : COLORS.textLight} 
            />
            <Text style={[styles.likeText, news.isLiked && styles.likedText]}>
              {news.likes}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton}>
            <MaterialIcons name="share" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
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
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  meta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  content: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  likeText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  likedText: {
    color: COLORS.error,
    fontWeight: '600',
  },
  shareButton: {
    padding: SPACING.xs,
  },
});