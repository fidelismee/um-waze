import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';

interface CategoryChipProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  active?: boolean;
  style?: ViewStyle;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  icon,
  onPress,
  active = false,
  style,
}) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive, style]}
    onPress={onPress}
    accessibilityRole="button"
  >
    {icon && (
      <Ionicons
        name={icon}
        size={14}
        color={active ? colors.card : colors.textSecondary}
      />
    )}
    <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  labelActive: { color: colors.card },
});
