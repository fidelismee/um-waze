import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../components/SearchBar';
import { CategoryChip } from '../components/CategoryChip';
import { SectionCard } from '../components/SectionCard';
import { UpcomingClassCard } from '../components/UpcomingClassCard';
import { UPCOMING_CLASS } from '../data/mockData';
import { colors, spacing } from '../theme';
import { TabParamList } from '../navigation/TabNavigator';

type HomeNavProp = BottomTabNavigationProp<TabParamList, 'Home'>;

const CATEGORIES: Array<{ id: string; label: string; icon: any; destinationId: string }> = [
  { id: 'cafe',    label: 'CAFE',    icon: 'cafe-outline',     destinationId: 'l6' },
  { id: 'lobby',   label: 'LOBBY',   icon: 'business-outline', destinationId: 'l5' },
  { id: 'surau',   label: 'SURAU',   icon: 'moon-outline',     destinationId: 'l7' },
  { id: 'library', label: 'LIBRARY', icon: 'library-outline',  destinationId: 'l8' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSearchSubmit = () => {
    const q = search.trim();
    navigation.navigate('Search', { initialQuery: q });
    setSearch('');
  };

  const handleCategoryPress = (cat: typeof CATEGORIES[0]) => {
    const next = activeCategory === cat.id ? null : cat.id;
    setActiveCategory(next);
    if (next) {
      navigation.navigate('Map', { destinationId: cat.destinationId });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="school" size={22} color={colors.primary} />
            <Text style={styles.logoText}>UM FSKTM Navigator</Text>
          </View>
          <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
        </View>

        <View style={styles.section}>
          <Text style={styles.greeting}>Good morning, Navigator</Text>
          <Text style={styles.subGreeting}>Where to in FSKTM today?</Text>
        </View>

        <View style={styles.section}>
          <SearchBar
            placeholder="Search rooms, labs, or staff..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearchSubmit}
            showQR
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {CATEGORIES.map(cat => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              active={activeCategory === cat.id}
              onPress={() => handleCategoryPress(cat)}
            />
          ))}
        </ScrollView>

        <View style={styles.section}>
          <UpcomingClassCard
            courseName={UPCOMING_CLASS.name}
            location={UPCOMING_CLASS.location}
            time={UPCOMING_CLASS.time}
            startsIn={UPCOMING_CLASS.startsIn}
            onNavigate={() =>
              navigation.navigate('Map', { destinationId: UPCOMING_CLASS.destinationId })
            }
          />
        </View>

        <View style={[styles.section, styles.sectionList]}>
          <SectionCard
            title="Computer Labs"
            description="Find open workstations across all blocks."
            icon="desktop-outline"
            onPress={() => navigation.navigate('Search', { initialQuery: 'lab' })}
          />
          <SectionCard
            title="Lecture Halls"
            description="DK1, DK2, and other main lecture spaces."
            icon="school-outline"
            onPress={() => navigation.navigate('Search', { initialQuery: 'lecture' })}
          />
          <SectionCard
            title="Staff Offices"
            description="Locate lecturers, admin, and support staff."
            icon="briefcase-outline"
            arrowColor={colors.primary}
            onPress={() => navigation.navigate('Directory')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  logo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  logoText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  section: { paddingHorizontal: spacing.md, marginBottom: spacing.md },
  greeting: { fontSize: 26, fontWeight: '700', color: colors.textPrimary },
  subGreeting: { fontSize: 15, color: colors.textSecondary, marginTop: 4 },
  chips: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.md },
  sectionList: { gap: spacing.sm, paddingBottom: spacing.xl },
});
