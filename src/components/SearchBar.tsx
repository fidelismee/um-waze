import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  onMicPress?: () => void;
  showQR?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSubmitEditing,
  onMicPress,
  showQR = false,
}) => (
  <View style={styles.container}>
    <Ionicons name="search" size={20} color={colors.textSecondary} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      returnKeyType="search"
    />
    {onMicPress && (
      <TouchableOpacity onPress={onMicPress} accessibilityLabel="mic">
        <Ionicons name="mic-outline" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    )}
    {showQR && (
      <TouchableOpacity accessibilityLabel="qr">
        <Ionicons name="qr-code-outline" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
});
