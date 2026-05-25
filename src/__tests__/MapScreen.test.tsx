import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapScreen } from '../screens/MapScreen';

const Tab = createBottomTabNavigator();
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NavigationContainer>
    <Tab.Navigator initialRouteName="Map">
      <Tab.Screen name="Home" component={() => null} />
      <Tab.Screen name="Map" component={() => <>{children}</>} />
      <Tab.Screen name="Search" component={() => null} />
      <Tab.Screen name="Directory" component={() => null} />
    </Tab.Navigator>
  </NavigationContainer>
);

describe('MapScreen', () => {
  it('renders map view and Find Route button', () => {
    const { getByTestId, getByText } = render(<MapScreen />, { wrapper: Wrapper as any });
    expect(getByTestId('map-view')).toBeTruthy();
    expect(getByText('Find Route')).toBeTruthy();
  });
});
