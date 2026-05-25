const React = require('react');
const { View } = require('react-native');

const MockMapView = React.forwardRef(({ children, testID, ...props }, ref) => {
  React.useImperativeHandle(ref, () => ({
    animateToRegion: () => {},
    animateToCoordinate: () => {},
    fitToCoordinates: () => {},
    fitToSuppliedMarkers: () => {},
    fitToElements: () => {},
  }));
  return React.createElement(View, { testID: testID ?? 'map-view', ...props }, children);
});

MockMapView.displayName = 'MockMapView';
MockMapView.Animated = MockMapView;

const MockMarker = (props) => React.createElement(View, props);
const MockPolyline = (props) => React.createElement(View, props);
const MockUrlTile = (props) => React.createElement(View, props);
const MockOverlay = (props) => React.createElement(View, props);

module.exports = {
  __esModule: true,
  default: MockMapView,
  Marker: MockMarker,
  Polyline: MockPolyline,
  UrlTile: MockUrlTile,
  Overlay: MockOverlay,
  PROVIDER_GOOGLE: 'google',
};
