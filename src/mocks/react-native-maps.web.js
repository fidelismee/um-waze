import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapView = React.forwardRef(function MapView({ children, style }, _ref) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Map view is not available on web</Text>
      {children}
    </View>
  );
});

const Marker = () => null;
const Polyline = () => null;
const UrlTile = () => null;
const Callout = () => null;
const Circle = () => null;
const Polygon = () => null;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8eaed',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: { color: '#888', fontSize: 14 },
});

export default MapView;
export { MapView, Marker, Polyline, UrlTile, Callout, Circle, Polygon };
