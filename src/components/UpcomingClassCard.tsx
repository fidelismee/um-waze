import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';

interface UpcomingClassCardProps {
  courseName: string;
  location: string;
  time: string;
  startsIn: string;
  onNavigate?: () => void;
}

export const UpcomingClassCard: React.FC<UpcomingClassCardProps> = ({
  courseName,
  location,
  time,
  startsIn,
  onNavigate,
}) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.label}>UPCOMING CLASS</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>STARTS IN {startsIn}</Text>
      </View>
    </View>
    <Text style={styles.courseName}>{courseName}</Text>
    <View style={styles.metaRow}>
      <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.7)" />
      <Text style={styles.meta}>{location}</Text>
    </View>
    <View style={styles.metaRow}>
      <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.7)" />
      <Text style={styles.meta}>{time}</Text>
    </View>
    <TouchableOpacity style={styles.navBtn} onPress={onNavigate} accessibilityRole="button">
      <Ionicons name="navigate-outline" size={16} color={colors.primary} />
      <Text style={styles.navBtnText}>Navigate</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: colors.primary },
  courseName: { fontSize: 20, fontWeight: '700', color: colors.card },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  meta: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  navBtnText: { fontSize: 15, fontWeight: '600', color: colors.card },
});
