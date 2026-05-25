import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CategoryChip } from '../components/CategoryChip';
import { StaffCard } from '../components/StaffCard';
import { STAFF, LOCATIONS } from '../data/mockData';
import { StaffMember } from '../types';
import { colors, spacing } from '../theme';
import { TabParamList } from '../navigation/TabNavigator';

type DirNavProp = BottomTabNavigationProp<TabParamList, 'Directory'>;

const FILTERS = ['All', 'Lecturers', 'Admin', 'Support'];

export const DirectoryScreen: React.FC = () => {
  const navigation = useNavigation<DirNavProp>();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(() => {
    if (activeFilter === 'Lecturers') {
      return STAFF.filter(
        s => s.title.includes('Lecturer') || s.title.includes('Professor'),
      );
    }
    if (activeFilter === 'Admin') {
      return STAFF.filter(s => s.department === 'Administration');
    }
    if (activeFilter === 'Support') {
      return STAFF.filter(s => s.department === 'Support');
    }
    return STAFF;
  }, [activeFilter]);

  const handleNavigate = (staff: StaffMember) => {
    const officeLocation = LOCATIONS.find(l => l.type === 'office') ?? LOCATIONS[0];
    navigation.navigate('Map', { destinationId: officeLocation.id });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="school" size={20} color={colors.primary} />
          <Text style={styles.logoText}>UM FSKTM Navigator</Text>
        </View>
        <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
      </View>

      <Text style={styles.title}>Faculty Directory</Text>

      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <CategoryChip
            key={f}
            label={f}
            active={activeFilter === f}
            onPress={() => setActiveFilter(f)}
          />
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <StaffCard staff={item} onNavigate={handleNavigate} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No staff in this category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  logo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  logoText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: colors.textSecondary },
});
