import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';

interface SectionCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  arrowColor?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  icon,
  onPress,
  arrowColor = colors.textSecondary,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} accessibilityRole="button">
    <View style={styles.iconBox}>
      <Ionicons name={icon} size={22} color={colors.primary} />
    </View>
    <View style={styles.textBox}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={arrowColor} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  description: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
