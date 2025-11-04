import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
      <BlurView intensity={isDarkMode ? 30 : 80} style={[styles.container, SHADOWS.medium]}>
        <LinearGradient
          colors={[colors.glass, colors.card]}
          style={styles.gradient}
        >
          <View style={[styles.fileIcon, { backgroundColor: fileColor + '20' }]}>
            <MaterialIcons name={fileIcon} size={34} color={fileColor} />
          </View>
          
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{resource.title}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>{resource.description}</Text>
            
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <MaterialIcons name="insert-drive-file" size={16} color={colors.textLight} />
                <Text style={[styles.metaText, { color: colors.textLight }]}>{resource.fileType.toUpperCase()}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <MaterialIcons name="storage" size={16} color={colors.textLight} />
                <Text style={[styles.metaText, { color: colors.textLight }]}>{resource.size}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <MaterialIcons name="download" size={16} color={colors.textLight} />
                <Text style={[styles.metaText, { color: colors.textLight }]}>{resource.downloads}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.downloadButton, { backgroundColor: colors.primary + '20' }]} 
            onPress={onDownload}
            activeOpacity={0.7}
          >
            <MaterialIcons name="download" size={26} color={colors.primary} />
          </TouchableOpacity>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  gradient: {
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    width: 68,
    height: 68,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h4,
    fontSize: 17,
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
    gap: SPACING.xs,
  },
  metaText: {
    ...TYPOGRAPHY.caption,
  },
  downloadButton: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
});