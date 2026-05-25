import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SearchBar } from '../components/SearchBar';
import { CategoryChip } from '../components/CategoryChip';
import { LOCATIONS } from '../data/mockData';
import { colors, spacing, radius } from '../theme';
import { TabParamList } from '../navigation/TabNavigator';

type MapRouteProp = RouteProp<TabParamList, 'Map'>;

const CAMPUS_CENTER = { latitude: 3.12090, longitude: 101.65558 };

const MOCK_ROUTE = [
  { latitude: 3.12060, longitude: 101.65550 },
  { latitude: 3.12060, longitude: 101.65558 },
  { latitude: 3.12075, longitude: 101.65558 },
];

const FILTER_CHIPS = ['Labs', 'Restrooms', 'Stairs'];
const FLOORS = ['3', '2', '1', 'G'];

export const MapScreen: React.FC = () => {
  const route = useRoute<MapRouteProp>();
  const mapRef = useRef<MapView>(null);
  const [search, setSearch] = useState('');
  const [activeFloor, setActiveFloor] = useState('1');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const destinationId = route.params?.destinationId;
  const destination = (destinationId ? LOCATIONS.find(l => l.id === destinationId) : null) ?? LOCATIONS[0];

  useEffect(() => {
    if (destination && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: destination.lat,
          longitude: destination.lng,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        },
        800,
      );
    }
  }, [destinationId]);

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
        <SearchBar placeholder="Search destination" value={search} onChangeText={setSearch} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {FILTER_CHIPS.map(chip => (
          <CategoryChip
            key={chip}
            label={chip}
            active={activeFilter === chip}
            onPress={() => setActiveFilter(p => (p === chip ? null : chip))}
          />
        ))}
      </ScrollView>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          testID="map-view"
          style={styles.map}
          initialRegion={{ ...CAMPUS_CENTER, latitudeDelta: 0.004, longitudeDelta: 0.004 }}
          mapType="none"
        >
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          <Polyline
            coordinates={MOCK_ROUTE}
            strokeColor={colors.primary}
            strokeWidth={3}
            lineDashPattern={[8, 4]}
          />
          <Marker coordinate={MOCK_ROUTE[0]} title="You">
            <View style={styles.userDot} />
          </Marker>
          <Marker
            coordinate={{ latitude: destination.lat, longitude: destination.lng }}
            title={destination.name}
            pinColor={colors.accent}
          />
        </MapView>

        <View style={styles.floorSelector}>
          {FLOORS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.floorBtn, activeFloor === f && styles.floorBtnActive]}
              onPress={() => setActiveFloor(f)}
            >
              <Text style={[styles.floorText, activeFloor === f && styles.floorTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.floorBtn}>
            <Ionicons name="add" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.floorBtn}>
            <Ionicons name="remove" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.routeHeader}>
          <View>
            <Text style={styles.routeLabel}>TO {destination.name.toUpperCase()}</Text>
            <View style={styles.routeRow}>
              <Text style={styles.routeDistance}>350m</Text>
              <Text style={styles.routeTime}> · 5 mins</Text>
            </View>
          </View>
          <View style={styles.turnIcon}>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.sm }}
        >
          <CategoryChip label="Cafe (80m)" icon="cafe-outline" />
          <CategoryChip label="Restrooms (45m)" icon="people-outline" />
        </ScrollView>

        <TouchableOpacity style={styles.findRouteBtn}>
          <Ionicons name="navigate-outline" size={18} color={colors.card} />
          <Text style={styles.findRouteBtnText}>Find Route</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: colors.background,
  },
  logo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  logoText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  searchRow: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  chips: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.sm },
  mapContainer: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  userDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.card,
  },
  floorSelector: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  floorBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  floorBtnActive: { backgroundColor: colors.primary },
  floorText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  floorTextActive: { color: colors.card },
  bottomSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  routeRow: { flexDirection: 'row', alignItems: 'baseline' },
  routeDistance: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  routeTime: { fontSize: 15, color: colors.textSecondary },
  turnIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  findRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  findRouteBtnText: { fontSize: 16, fontWeight: '700', color: colors.card },
});
