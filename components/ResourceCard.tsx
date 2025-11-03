import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInLeft, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Resource } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

interface ResourceCardProps {
  resource: Resource;
  onDownload: () => void;
  index: number;
}

const fileTypeIcons = {
  pdf: 'picture-as-pdf' as const,
  doc: 'description' as const,
  ppt: 'slideshow' as const,
  xlsx: 'table-chart' as const,
};

const fileTypeColors = {
  pdf: '#DC2626',
  doc: '#2563EB',
  ppt: '#EA580C',
  xlsx: '#059669',
};

export default function ResourceCard({ resource, onDownload, index }: ResourceCardProps) {
  const { colors, isDarkMode } = useTheme();
  const scale = useSharedValue(1);
  const downloadScale = useSharedValue(1);
  
  const fileIcon = fileTypeIcons[resource.fileType];
  const fileColor = fileTypeColors[resource.fileType];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const downloadAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: downloadScale.value }],
  }));

  const handleDownload = () => {
    downloadScale.value = withSpring(0.9, {}, () => {
      downloadScale.value = withSpring(1);
    });
    onDownload();
  };

  return (
    <Animated.View entering={FadeInLeft.delay(index * 100).springify()} style={animatedStyle}>
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
            <LinearGradient
              colors={[fileColor, fileColor + 'DD']}
              style={styles.fileIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name={fileIcon} size={36} color="#FFFFFF" />
            </LinearGradient>
            
            <View style={styles.content}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{resource.title}</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>{resource.description}</Text>
              
              <View style={styles.metaRow}>
                <View style={[styles.metaBadge, { backgroundColor: fileColor + '20' }]}>
                  <MaterialIcons name="insert-drive-file" size={12} color={fileColor} />
                  <Text style={[styles.metaText, { color: fileColor }]}>{resource.fileType.toUpperCase()}</Text>
                </View>
                
                <View style={[styles.metaBadge, { backgroundColor: colors.info + '20' }]}>
                  <MaterialIcons name="storage" size={12} color={colors.info} />
                  <Text style={[styles.metaText, { color: colors.info }]}>{resource.size}</Text>
                </View>
                
                <View style={[styles.metaBadge, { backgroundColor: colors.success + '20' }]}>
                  <MaterialIcons name="download" size={12} color={colors.success} />
                  <Text style={[styles.metaText, { color: colors.success }]}>{resource.downloads}</Text>
                </View>
              </View>
            </View>
            
            <Animated.View style={downloadAnimatedStyle}>
              <TouchableOpacity 
                style={[styles.downloadButton, { backgroundColor: colors.primary }]} 
                onPress={handleDownload}
                activeOpacity={0.8}
              >
                <MaterialIcons name="download" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    marginBottom: SPACING.xs,
  },
  description: {
    ...TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    gap: 4,
  },
  metaText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  downloadButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});