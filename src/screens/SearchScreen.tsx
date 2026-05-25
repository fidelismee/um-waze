import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../components/SearchBar';
import { CategoryChip } from '../components/CategoryChip';
import { buildSearchResults, SearchResult } from '../utils/search';
import { LOCATIONS, STAFF } from '../data/mockData';
import { colors, spacing, radius } from '../theme';
import { TabParamList } from '../navigation/TabNavigator';

type SearchNavProp = BottomTabNavigationProp<TabParamList, 'Search'>;

const FILTERS = ['All', 'Rooms', 'Labs', 'Staff', 'Facilities'];

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchNavProp>();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const results = useMemo(
    () => buildSearchResults(LOCATIONS, STAFF, query, activeFilter),
    [query, activeFilter],
  );

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => {
        if (item.locationId) {
          navigation.navigate('Map', { destinationId: item.locationId });
        }
      }}
    >
      <View style={styles.resultIcon}>
        <Ionicons
          name={item.kind === 'staff' ? 'person-outline' : 'location-outline'}
          size={20}
          color={colors.primary}
        />
      </View>
      <View style={styles.resultText}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultSub}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="school" size={20} color={colors.primary} />
          <Text style={styles.logoText}>UM FSKTM Navigator</Text>
        </View>
        <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
      </View>

      <View style={styles.searchRow}>
        <SearchBar
          placeholder="Search rooms, labs, or staff..."
          value={query}
          onChangeText={setQuery}
        />
      </View>

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
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search" size={40} color={colors.border} />
            <Text style={styles.emptyText}>
              No results{query ? ` for "${query}"` : ''}
            </Text>
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
  searchRow: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  list: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.xl },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: { flex: 1 },
  resultName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  resultSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: 80, gap: spacing.md },
  emptyText: { fontSize: 15, color: colors.textSecondary },
});
