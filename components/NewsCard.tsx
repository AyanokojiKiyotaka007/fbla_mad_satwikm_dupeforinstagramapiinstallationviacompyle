import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { NewsItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

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
  const { colors, isDarkMode } = useTheme();
  const scale = useSharedValue(1);
  const likeScale = useSharedValue(1);
  
  const categoryColors = {
    announcement: colors.primary,
    achievement: colors.success,
    reminder: colors.warning,
    update: colors.info,
  };
  
  const categoryColor = categoryColors[news.category];
  const categoryIcon = categoryIcons[news.category];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const handleLike = () => {
    likeScale.value = withSpring(1.3, {}, () => {
      likeScale.value = withSpring(1);
    });
    onLike();
  };

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()} style={animatedStyle}>
      <View style={styles.container}>
        <BlurView intensity={isDarkMode ? 30 : 90} style={styles.blurContainer}>
          <LinearGradient
            colors={isDarkMode 
              ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
              : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.6)']
            }
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.header}>
              <LinearGradient
                colors={[categoryColor, categoryColor + 'CC']}
                style={styles.categoryIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name={categoryIcon} size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.headerText}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{news.title}</Text>
                <View style={styles.metaContainer}>
                  <View style={[styles.authorBadge, { backgroundColor: colors.primary + '15' }]}>
                    <MaterialIcons name="person" size={12} color={colors.primary} />
                    <Text style={[styles.meta, { color: colors.textLight }]}>{news.author}</Text>
                  </View>
                  <Text style={[styles.meta, { color: colors.textLight }]}>• {news.date}</Text>
                </View>
              </View>
            </View>
            
            <Text style={[styles.content, { color: colors.textSecondary }]} numberOfLines={3}>{news.content}</Text>
            
            <View style={[styles.footer, { borderTopColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
              <Animated.View style={likeAnimatedStyle}>
                <TouchableOpacity 
                  style={[styles.likeButton, news.isLiked && { backgroundColor: colors.error + '15' }]} 
                  onPress={handleLike}
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
              </Animated.View>
              
              <TouchableOpacity style={styles.shareButton}>
                <MaterialIcons name="share" size={20} color={colors.textLight} />
                <Text style={[styles.shareText, { color: colors.textLight }]}>Share</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </BlurView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  blurContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gradient: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
    marginBottom: SPACING.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  authorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    gap: 4,
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
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    gap: SPACING.md,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  likeText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  shareText: {
    ...TYPOGRAPHY.bodySmall,
  },
});