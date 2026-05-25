import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StaffMember } from '../types';
import { colors, spacing, radius } from '../theme';

interface StaffCardProps {
  staff: StaffMember;
  onNavigate?: (staff: StaffMember) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0])
    .join('');
}

export const StaffCard: React.FC<StaffCardProps> = ({ staff, onNavigate }) => (
  <View style={styles.card}>
    <View style={styles.avatar}>
      <Text style={styles.initials}>{getInitials(staff.name)}</Text>
    </View>
    <View style={styles.info}>
      <Text style={styles.name}>{staff.name}</Text>
      <Text style={styles.title}>{staff.title}</Text>
      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
        <Text style={styles.meta}>{staff.room}</Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="book-outline" size={12} color={colors.textSecondary} />
        <Text style={styles.meta}>{staff.course}</Text>
      </View>
    </View>
    {onNavigate && (
      <TouchableOpacity
        style={styles.navBtn}
        onPress={() => onNavigate(staff)}
        accessibilityLabel={`Navigate to ${staff.name}`}
      >
        <Text style={styles.navBtnText}>Navigate</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: colors.card, fontWeight: '700', fontSize: 16 },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  title: { fontSize: 13, color: colors.textSecondary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  meta: { fontSize: 12, color: colors.textSecondary },
  navBtn: {
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  navBtnText: { fontSize: 12, fontWeight: '600', color: colors.primary },
});
