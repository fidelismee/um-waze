import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  useWindowDimensions,
  DimensionValue,
} from 'react-native';
import { Location } from '../types';
import { colors, spacing, radius } from '../theme';

const PLAN_H = 260;
const DOT_SIZE = 16;
const SEG_DURATION = 1600; // ms per segment

interface RoomDef {
  id: string;
  label: string;
  left: DimensionValue;
  top: DimensionValue;
  width: DimensionValue;
  height: DimensionValue;
  isSpecial?: boolean;
}

const FLOOR_DATA: Record<string, {
  rooms: RoomDef[];
  corridorTop: DimensionValue;
}> = {
  G: {
    corridorTop: '55%',
    rooms: [
      { id: 'l6',       label: 'Cafe',       left: '3%',  top: '18%', width: '22%', height: '28%' },
      { id: 'l5',       label: 'Main Lobby', left: '27%', top: '18%', width: '45%', height: '28%' },
      { id: 'entrance', label: 'Entrance ↑', left: '37%', top: '74%', width: '22%', height: '14%', isSpecial: true },
    ],
  },
  '1': {
    corridorTop: '35%',
    rooms: [
      { id: 'l1',   label: 'AI Lab 01', left: '3%',  top: '8%',  width: '37%', height: '24%' },
      { id: 'l7',   label: 'Surau',     left: '43%', top: '8%',  width: '13%', height: '24%' },
      { id: 'l3',   label: 'DK1',       left: '58%', top: '8%',  width: '36%', height: '24%' },
      { id: 'l2',   label: 'Lab 02',    left: '3%',  top: '44%', width: '37%', height: '24%' },
      { id: 'lift', label: '🛗 Lift',  left: '43%', top: '44%', width: '13%', height: '24%', isSpecial: true },
      { id: 'l4',   label: 'DK2',       left: '58%', top: '44%', width: '36%', height: '24%' },
    ],
  },
  '2': {
    corridorTop: '58%',
    rooms: [
      { id: 'l8',  label: 'Library Reading Room', left: '8%',  top: '14%', width: '78%', height: '40%' },
      { id: 'lift',label: '🛗 Lift',              left: '43%', top: '68%', width: '13%', height: '14%', isSpecial: true },
    ],
  },
  '3': {
    corridorTop: '54%',
    rooms: [
      { id: 'l9',  label: 'Staff Offices A-09', left: '8%',  top: '14%', width: '78%', height: '35%' },
      { id: 'lift',label: '🛗 Lift',            left: '43%', top: '68%', width: '13%', height: '14%', isSpecial: true },
    ],
  },
};

export function getNavFloorLabel(dest: Location): string {
  if (dest.id === 'l9') return '3';
  if (dest.floor === 0) return 'G';
  if (dest.floor <= 3) return String(dest.floor);
  return '3';
}

// Waypoints as {x%, y%} within the plan container
function getWaypoints(dest: Location): Array<{ x: number; y: number }> {
  switch (dest.id) {
    case 'l5': return [{ x: 48, y: 82 }, { x: 48, y: 60 }, { x: 49, y: 32 }];
    case 'l6': return [{ x: 48, y: 82 }, { x: 48, y: 60 }, { x: 14, y: 60 }, { x: 14, y: 32 }];
    case 'l1': return [{ x: 49.5, y: 56 }, { x: 49.5, y: 39 }, { x: 21.5, y: 39 }, { x: 21.5, y: 20 }];
    case 'l2': return [{ x: 49.5, y: 56 }, { x: 49.5, y: 39 }, { x: 21.5, y: 39 }, { x: 21.5, y: 56 }];
    case 'l3': return [{ x: 49.5, y: 56 }, { x: 49.5, y: 39 }, { x: 76, y: 39 },   { x: 76, y: 20 }];
    case 'l4': return [{ x: 49.5, y: 56 }, { x: 49.5, y: 39 }, { x: 76, y: 39 },   { x: 76, y: 56 }];
    case 'l7': return [{ x: 49.5, y: 56 }, { x: 49.5, y: 39 }, { x: 49.5, y: 20 }];
    case 'l8': return [{ x: 49.5, y: 75 }, { x: 49.5, y: 62 }, { x: 48, y: 34 }];
    case 'l9': return [{ x: 49.5, y: 75 }, { x: 49.5, y: 58 }, { x: 48, y: 32 }];
    default:   return [{ x: 48, y: 75 },   { x: 48, y: 40 }];
  }
}

interface Props {
  destination: Location;
  isActive: boolean;
  onStepChange: (step: number) => void;
}

export const IndoorNavigationView: React.FC<Props> = ({
  destination,
  isActive,
  onStepChange,
}) => {
  const { width: screenW } = useWindowDimensions();
  const planW = screenW - spacing.md * 2 - 2;

  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef<Animated.CompositeAnimation | null>(null);
  const moveAnim = useRef<Animated.CompositeAnimation | null>(null);

  const floorLabel = getNavFloorLabel(destination);
  const floorData = FLOOR_DATA[floorLabel] ?? FLOOR_DATA['1'];
  const waypoints = getWaypoints(destination);

  // Pulsing glow around the dot
  useEffect(() => {
    pulseAnim.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.8,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
      ]),
    );
    pulseAnim.current.start();
    return () => pulseAnim.current?.stop();
  }, [pulse]);

  // Movement along waypoints
  useEffect(() => {
    moveAnim.current?.stop();
    if (!isActive) return;

    const first = waypoints[0];
    pos.setValue({
      x: (first.x / 100) * planW - DOT_SIZE / 2,
      y: (first.y / 100) * PLAN_H - DOT_SIZE / 2,
    });
    onStepChange(0);

    const segments = waypoints.slice(1).map((wp, i) =>
      Animated.timing(pos, {
        toValue: {
          x: (wp.x / 100) * planW - DOT_SIZE / 2,
          y: (wp.y / 100) * PLAN_H - DOT_SIZE / 2,
        },
        duration: SEG_DURATION,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
      }),
    );

    let idx = 0;
    const runNext = () => {
      if (idx >= segments.length) {
        onStepChange(waypoints.length); // signals arrival
        return;
      }
      segments[idx].start(({ finished }) => {
        if (!finished) return;
        idx++;
        onStepChange(idx);
        runNext();
      });
      moveAnim.current = segments[idx - 1] ?? null;
    };

    // Small delay before starting so the view has rendered
    const t = setTimeout(runNext, 200);
    return () => {
      clearTimeout(t);
      segments.forEach(s => s.stop());
    };
  }, [isActive, destination.id, planW]);

  return (
    <View style={[styles.container, { height: PLAN_H }]}>
      {/* Corridor strip */}
      <View style={[styles.corridor, { top: floorData.corridorTop }]} />

      {/* Room boxes */}
      {floorData.rooms.map(room => {
        const isDest = room.id === destination.id;
        return (
          <View
            key={room.id}
            style={[
              styles.room,
              { left: room.left, top: room.top, width: room.width, height: room.height },
              isDest && styles.roomDest,
              room.isSpecial && styles.roomSpecial,
            ]}
          >
            <Text
              style={[styles.roomLabel, isDest && styles.roomLabelDest]}
              numberOfLines={2}
            >
              {room.label}
            </Text>
            {isDest && (
              <View style={styles.destPin}>
                <Text style={styles.destPinText}>📍</Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Floor badge */}
      <View style={styles.floorBadge}>
        <Text style={styles.floorBadgeText}>
          Floor {floorLabel === 'G' ? 'Ground' : floorLabel}
        </Text>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendDot} />
        <Text style={styles.legendText}>You</Text>
      </View>

      {/* Animated dot */}
      <Animated.View style={[styles.dotWrapper, { left: pos.x, top: pos.y }]}>
        <Animated.View style={[styles.dotPulse, { transform: [{ scale: pulse }] }]} />
        <View style={styles.dotCore} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#EEF2F7',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  corridor: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '10%',
    backgroundColor: '#D8E0EA',
  },
  room: {
    position: 'absolute',
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  roomDest: {
    backgroundColor: '#E8F0FE',
    borderColor: colors.primary,
    borderWidth: 2,
  },
  roomSpecial: {
    backgroundColor: '#F0F4FF',
    borderColor: '#C7D2FE',
  },
  roomLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 12,
  },
  roomLabelDest: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 9,
  },
  destPin: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
  },
  destPinText: { fontSize: 12 },
  floorBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  floorBadgeText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },
  legend: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  legendText: { fontSize: 10, fontWeight: '600', color: colors.textSecondary },
  dotWrapper: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPulse: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.primary + '50',
  },
  dotCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.card,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
});
