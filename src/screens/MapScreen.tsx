import React, { useEffect, useRef, useState, useMemo } from 'react';
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
import { IndoorNavigationView, getNavFloorLabel } from '../components/IndoorNavigationView';
import { LOCATIONS } from '../data/mockData';
import { Location } from '../types';
import { colors, spacing, radius, typography } from '../theme';
import { TabParamList } from '../navigation/TabNavigator';

type MapRouteProp = RouteProp<TabParamList, 'Map'>;

const CAMPUS_CENTER = { latitude: 3.12090, longitude: 101.65558 };
const FLOOR_LABELS = ['3', '2', '1', 'G'];
const FILTER_CHIPS = ['Labs', 'Restrooms', 'Stairs'];

function floorLabelToNumber(label: string): number {
  return label === 'G' ? 0 : parseInt(label, 10);
}

function getMockDirections(dest: Location): string[] {
  if (dest.floor === 0) {
    return [
      'Exit from the main FSKTM entrance',
      `Enter ${dest.block} on the ground floor`,
      'Follow the corridor straight ahead',
      `${dest.name} is on your left`,
    ];
  }
  return [
    'Exit from the main FSKTM entrance',
    `Enter ${dest.block} and locate the lift`,
    `Take the lift to Floor ${dest.floor}`,
    'Turn right at the corridor junction',
    `${dest.name} is ahead on your left`,
  ];
}

export const MapScreen: React.FC = () => {
  const route = useRoute<MapRouteProp>();
  const mapRef = useRef<MapView>(null);

  const [search, setSearch] = useState('');
  const [activeFloor, setActiveFloor] = useState('1');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentNavStep, setCurrentNavStep] = useState(0);
  const [arrived, setArrived] = useState(false);

  const destinationId = route.params?.destinationId;
  const [selectedDestination, setSelectedDestination] = useState<Location>(
    () => LOCATIONS.find(l => l.id === destinationId) ?? LOCATIONS[0],
  );

  // Sync destination when navigating from another screen
  useEffect(() => {
    const newDest = LOCATIONS.find(l => l.id === destinationId) ?? LOCATIONS[0];
    setSelectedDestination(newDest);
    setSearch('');
    setShowDropdown(false);
    stopNavigation();
  }, [destinationId]);

  // Animate map camera to destination
  useEffect(() => {
    if (isNavigating) return;
    mapRef.current?.animateToRegion(
      {
        latitude: selectedDestination.lat,
        longitude: selectedDestination.lng,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      },
      800,
    );
  }, [selectedDestination, isNavigating]);

  const stopNavigation = () => {
    setIsNavigating(false);
    setCurrentNavStep(0);
    setArrived(false);
  };

  const startNavigation = () => {
    setCurrentNavStep(0);
    setArrived(false);
    setActiveFloor(getNavFloorLabel(selectedDestination));
    setIsNavigating(true);
  };

  // Dynamic polyline from campus center to destination
  const routeCoords = useMemo(() => [
    CAMPUS_CENTER,
    {
      latitude: (CAMPUS_CENTER.latitude + selectedDestination.lat) / 2,
      longitude: (CAMPUS_CENTER.longitude + selectedDestination.lng) / 2,
    },
    { latitude: selectedDestination.lat, longitude: selectedDestination.lng },
  ], [selectedDestination]);

  // Markers filtered by active floor
  const floorNumber = floorLabelToNumber(activeFloor);
  const visibleLocations = useMemo(
    () => LOCATIONS.filter(l => l.floor === floorNumber),
    [floorNumber],
  );

  // Search dropdown
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
    stopNavigation();
    const label = loc.floor === 0 ? 'G' : String(loc.floor);
    if (FLOOR_LABELS.includes(label)) setActiveFloor(label);
  };

  // Navigation step callback from IndoorNavigationView
  const handleStepChange = (step: number) => {
    const directions = getMockDirections(selectedDestination);
    if (step >= directions.length) {
      setArrived(true);
    } else {
      setCurrentNavStep(step);
    }
  };

  const directions = getMockDirections(selectedDestination);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="school" size={20} color={colors.primary} />
          <Text style={styles.logoText}>UM FSKTM Navigator</Text>
        </View>
        <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
      </View>

      {/* Search bar + dropdown — hidden while navigating */}
      {!isNavigating && (
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
      )}

      {/* Filter chips — hidden while navigating */}
      {!isNavigating && (
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
      )}

      {/* Map area — swaps between outdoor map and indoor nav */}
      <View style={styles.mapArea}>
        {isNavigating ? (
          /* ── Indoor navigation view ── */
          <View style={styles.indoorWrapper}>
            <IndoorNavigationView
              destination={selectedDestination}
              isActive={isNavigating}
              onStepChange={handleStepChange}
            />
          </View>
        ) : (
          /* ── Outdoor map ── */
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
              <Marker coordinate={CAMPUS_CENTER} title="You">
                <View style={styles.userDot} />
              </Marker>
              <Marker
                coordinate={{ latitude: selectedDestination.lat, longitude: selectedDestination.lng }}
                title={selectedDestination.name}
                pinColor={colors.accent}
              />
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
                  onPress={() => setActiveFloor(f)}
                >
                  <Text style={[styles.floorText, activeFloor === f && styles.floorTextActive]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* ── Bottom sheet ── */}
      {isNavigating ? (
        /* Navigation panel */
        <View style={styles.bottomSheet}>
          {arrived ? (
            /* Arrived state */
            <View style={styles.arrivedBox}>
              <Text style={styles.arrivedEmoji}>🎉</Text>
              <Text style={styles.arrivedTitle}>You have arrived!</Text>
              <Text style={styles.arrivedSub}>{selectedDestination.name}</Text>
            </View>
          ) : (
            /* Active navigation */
            <>
              {/* Current step */}
              <View style={styles.currentStepBox}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>{currentNavStep + 1}</Text>
                </View>
                <Text style={styles.currentStepText} numberOfLines={2}>
                  {directions[currentNavStep] ?? directions[directions.length - 1]}
                </Text>
              </View>

              {/* Progress dots */}
              <View style={styles.progressRow}>
                {directions.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.progressDot,
                      i === currentNavStep && styles.progressDotActive,
                      i < currentNavStep && styles.progressDotDone,
                    ]}
                  />
                ))}
                <Text style={styles.progressLabel}>
                  {currentNavStep + 1} / {directions.length}
                </Text>
              </View>

              {/* Upcoming steps */}
              {directions.slice(currentNavStep + 1, currentNavStep + 3).map((step, i) => (
                <View key={i} style={styles.upcomingStep}>
                  <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
                  <Text style={styles.upcomingStepText} numberOfLines={1}>{step}</Text>
                </View>
              ))}
            </>
          )}

          {/* Stop navigation */}
          <TouchableOpacity style={styles.stopBtn} onPress={stopNavigation}>
            <Ionicons name="close-circle-outline" size={18} color={colors.card} />
            <Text style={styles.stopBtnText}>Stop Navigation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Normal route card */
        <View style={styles.bottomSheet}>
          <View style={styles.routeHeader}>
            <View style={{ flex: 1 }}>
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

          <TouchableOpacity style={styles.findRouteBtn} onPress={startNavigation}>
            <Ionicons name="navigate-outline" size={18} color={colors.card} />
            <Text style={styles.findRouteBtnText}>Start Indoor Navigation</Text>
          </TouchableOpacity>
        </View>
      )}
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

  // Search
  searchWrapper: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    zIndex: 20,
    elevation: 20,
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
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    zIndex: 30,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  dropdownSub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },

  chips: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.sm },

  // Map area
  mapArea: { flex: 1 },
  mapContainer: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  userDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2, borderColor: colors.card,
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  floorBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  floorBtnActive: { backgroundColor: colors.primary },
  floorText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  floorTextActive: { color: colors.card },

  // Indoor nav
  indoorWrapper: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },

  // Bottom sheet
  bottomSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderColor: colors.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  // Normal route card
  routeHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  routeLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  routeRow: { flexDirection: 'row', alignItems: 'baseline' },
  routeDistance: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  routeTime: { fontSize: 15, color: colors.textSecondary },
  turnIcon: {
    width: 44, height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.chipBg,
    alignItems: 'center', justifyContent: 'center',
  },
  findRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  findRouteBtnText: { fontSize: 16, fontWeight: '700', color: colors.card },

  // Navigation panel
  currentStepBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.chipBg,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  stepNumberBadge: {
    width: 30, height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: { fontSize: 13, fontWeight: '700', color: colors.card },
  currentStepText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.primary, lineHeight: 20 },

  progressRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
  },
  progressDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: { backgroundColor: colors.primary, width: 20, borderRadius: 4 },
  progressDotDone: { backgroundColor: colors.primary + '80' },
  progressLabel: { marginLeft: 'auto', fontSize: 12, fontWeight: '600', color: colors.textSecondary },

  upcomingStep: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
  },
  upcomingStepText: { fontSize: 13, color: colors.textSecondary, flex: 1 },

  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#DC2626',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    marginTop: spacing.xs,
  },
  stopBtnText: { fontSize: 15, fontWeight: '700', color: colors.card },

  // Arrived
  arrivedBox: {
    alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm,
  },
  arrivedEmoji: { fontSize: 32 },
  arrivedTitle: { fontSize: 20, fontWeight: '700', color: colors.primary },
  arrivedSub: { fontSize: 14, color: colors.textSecondary },
});
