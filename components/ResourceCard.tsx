import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { Resource } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../constants/theme';

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
  const fileIcon = fileTypeIcons[resource.fileType];
  const fileColor = fileTypeColors[resource.fileType];

  return (
    <Animated.View entering={FadeInLeft.delay(index * 100).springify()}>
      <BlurView 
        intensity={isDarkMode ? 45 : 95} 
        tint={isDarkMode ? 'dark' : 'light'}
        style={[styles.container, SHADOWS.medium]}
      >
        <View style={[styles.cardInner, { 
          borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)', 
          borderWidth: 1.5,
          backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
        }]}>
          <View style={[styles.fileIcon, { backgroundColor: fileColor + '20' }]}>
            <MaterialIcons name={fileIcon} size={32} color={fileColor} />
          </View>
          
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{resource.title}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>{resource.description}</Text>
            
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <MaterialIcons name="insert-drive-file" size={14} color={colors.textLight} />
                <Text style={[styles.metaText, { color: colors.textLight }]}>{resource.fileType.toUpperCase()}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <MaterialIcons name="storage" size={14} color={colors.textLight} />
                <Text style={[styles.metaText, { color: colors.textLight }]}>{resource.size}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <MaterialIcons name="download" size={14} color={colors.textLight} />
                <Text style={[styles.metaText, { color: colors.textLight }]}>{resource.downloads}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.downloadButton, { backgroundColor: fileColor + '20' }]} 
            onPress={onDownload}
            activeOpacity={0.7}
          >
            <MaterialIcons name="download" size={24} color={fileColor} />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  cardInner: {
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
  },
  fileIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    marginRight: SPACING.sm,
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
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  metaText: {
    ...TYPOGRAPHY.caption,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  downloadButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
