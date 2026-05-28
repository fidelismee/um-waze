import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SearchBar } from '../components/SearchBar';
import { CategoryChip } from '../components/CategoryChip';
import { LOCATIONS } from '../data/mockData';
import { Location } from '../types';
import { colors, spacing, radius } from '../theme';
import { TabParamList } from '../navigation/TabNavigator';

type MapRouteProp = RouteProp<TabParamList, 'Map'>;

const CAMPUS_CENTER = { latitude: 3.12090, longitude: 101.65558 };
const FLOOR_LABELS = ['3', '2', '1', 'G'];

function floorLabelToNumber(label: string): number {
  return label === 'G' ? 0 : parseInt(label, 10);
}

function getMockDirections(dest: Location): string[] {
  const steps = ['Exit from the main FSKTM entrance'];
  if (dest.floor === 0) {
    steps.push(`Head straight into ${dest.block}`);
  } else {
    steps.push(`Enter ${dest.block} and take the lift or stairs`);
    steps.push(`Go to Floor ${dest.floor}`);
  }
  steps.push(`Turn right at the corridor junction`);
  steps.push(`${dest.name} is on your left — look for the signage`);
  return steps;
}

export const MapScreen: React.FC = () => {
  const route = useRoute<MapRouteProp>();
  const mapRef = useRef<MapView>(null);
  const [search, setSearch] = useState('');
  const [activeFloor, setActiveFloor] = useState('1');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const destinationId = route.params?.destinationId;

  const [selectedDestination, setSelectedDestination] = useState<Location>(
    () => LOCATIONS.find(l => l.id === destinationId) ?? LOCATIONS[0],
  );

  // Sync when navigation params change (e.g. tapping a search result)
  useEffect(() => {
    const newDest = LOCATIONS.find(l => l.id === destinationId) ?? LOCATIONS[0];
    setSelectedDestination(newDest);
    setSearch('');
    setShowDropdown(false);
    setShowDirections(false);
  }, [destinationId]);

  // Animate camera whenever destination changes
  useEffect(() => {
    mapRef.current?.animateToRegion(
      {
        latitude: selectedDestination.lat,
        longitude: selectedDestination.lng,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      },
      800,
    );
  }, [selectedDestination]);

  // Route polyline from campus center → destination
  const routeCoords = useMemo(() => [
    { latitude: CAMPUS_CENTER.latitude, longitude: CAMPUS_CENTER.longitude },
    {
      latitude: (CAMPUS_CENTER.latitude + selectedDestination.lat) / 2,
      longitude: (CAMPUS_CENTER.longitude + selectedDestination.lng) / 2,
    },
    { latitude: selectedDestination.lat, longitude: selectedDestination.lng },
  ], [selectedDestination]);

  // Filter markers by selected floor
  const floorNumber = floorLabelToNumber(activeFloor);
  const visibleLocations = useMemo(
    () => LOCATIONS.filter(l => l.floor === floorNumber),
    [floorNumber],
  );

  // Search dropdown results
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return LOCATIONS.filter(l => l.name.toLowerCase().includes(q));
  }, [search]);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    setShowDropdown(text.trim().length > 0);
  };

  const handleSelectFromDropdown = (loc: Location) => {
    setSelectedDestination(loc);
    setSearch('');
    setShowDropdown(false);
    setShowDirections(false);
    const label = loc.floor === 0 ? 'G' : String(loc.floor);
    if (FLOOR_LABELS.includes(label)) setActiveFloor(label);
  };

  const FILTER_CHIPS = ['Labs', 'Restrooms', 'Stairs'];
  const directions = getMockDirections(selectedDestination);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="school" size={20} color={colors.primary} />
          <Text style={styles.logoText}>UM FSKTM Navigator</Text>
        </View>
        <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
      </View>

      {/* Search bar + dropdown */}
      <View style={styles.searchWrapper}>
        <SearchBar
          placeholder="Search destination"
          value={search}
          onChangeText={handleSearchChange}
          onSubmitEditing={() => {
            if (searchResults.length > 0) handleSelectFromDropdown(searchResults[0]);
          }}
        />
        {showDropdown && searchResults.length > 0 && (
          <View style={styles.dropdown}>
            {searchResults.map(loc => (
              <TouchableOpacity
                key={loc.id}
                style={styles.dropdownItem}
                onPress={() => handleSelectFromDropdown(loc)}
              >
                <Ionicons name="location-outline" size={16} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.dropdownName}>{loc.name}</Text>
                  <Text style={styles.dropdownSub}>
                    {loc.block} · Floor {loc.floor === 0 ? 'G' : loc.floor}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
            coordinates={routeCoords}
            strokeColor={colors.primary}
            strokeWidth={3}
            lineDashPattern={[8, 4]}
          />
          {/* User dot at campus center */}
          <Marker coordinate={CAMPUS_CENTER} title="You">
            <View style={styles.userDot} />
          </Marker>
          {/* Destination marker */}
          <Marker
            coordinate={{ latitude: selectedDestination.lat, longitude: selectedDestination.lng }}
            title={selectedDestination.name}
            pinColor={colors.accent}
          />
          {/* Floor markers */}
          {visibleLocations
            .filter(l => l.id !== selectedDestination.id)
            .map(loc => (
              <Marker
                key={loc.id}
                coordinate={{ latitude: loc.lat, longitude: loc.lng }}
                title={loc.name}
                onPress={() => handleSelectFromDropdown(loc)}
              />
            ))}
        </MapView>

        {/* Floor selector */}
        <View style={styles.floorSelector}>
          {FLOOR_LABELS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.floorBtn, activeFloor === f && styles.floorBtnActive]}
              onPress={() => {
                setActiveFloor(f);
                setShowDirections(false);
              }}
            >
              <Text style={[styles.floorText, activeFloor === f && styles.floorTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.floorBtn}
            onPress={() => {
              const idx = FLOOR_LABELS.indexOf(activeFloor);
              if (idx > 0) setActiveFloor(FLOOR_LABELS[idx - 1]);
            }}
          >
            <Ionicons name="add" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.floorBtn}
            onPress={() => {
              const idx = FLOOR_LABELS.indexOf(activeFloor);
              if (idx < FLOOR_LABELS.length - 1) setActiveFloor(FLOOR_LABELS[idx + 1]);
            }}
          >
            <Ionicons name="remove" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={styles.bottomSheet}>
        {showDirections ? (
          <>
            <View style={styles.routeHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.routeLabel}>DIRECTIONS TO {selectedDestination.name.toUpperCase()}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowDirections(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={directions}
              keyExtractor={(_, i) => String(i)}
              style={{ maxHeight: 120 }}
              renderItem={({ item, index }) => (
                <View style={styles.directionStep}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{item}</Text>
                </View>
              )}
            />
          </>
        ) : (
          <>
            <View style={styles.routeHeader}>
              <View>
                <Text style={styles.routeLabel}>TO {selectedDestination.name.toUpperCase()}</Text>
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

            <TouchableOpacity
              style={styles.findRouteBtn}
              onPress={() => setShowDirections(true)}
            >
              <Ionicons name="navigate-outline" size={18} color={colors.card} />
              <Text style={styles.findRouteBtnText}>Find Route</Text>
            </TouchableOpacity>
          </>
        )}
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
  searchWrapper: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    zIndex: 10,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 20,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  dropdownSub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
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
  directionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs + 2,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: { fontSize: 11, fontWeight: '700', color: colors.card },
  stepText: { flex: 1, fontSize: 13, color: colors.textPrimary, lineHeight: 18 },
});
