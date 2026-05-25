import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen name="Home" component={() => <>{children}</>} />
      <Tab.Screen name="Map" component={() => null} />
      <Tab.Screen name="Search" component={() => null} />
      <Tab.Screen name="Directory" component={() => null} />
    </Tab.Navigator>
  </NavigationContainer>
);

describe('HomeScreen', () => {
  it('renders greeting and section cards', () => {
    const { getByText } = render(<HomeScreen />, { wrapper: Wrapper as any });
    expect(getByText('Good morning, Navigator')).toBeTruthy();
    expect(getByText('Computer Labs')).toBeTruthy();
    expect(getByText('Lecture Halls')).toBeTruthy();
    expect(getByText('Staff Offices')).toBeTruthy();
  });

  it('renders the upcoming class card', () => {
    const { getByText } = render(<HomeScreen />, { wrapper: Wrapper as any });
    expect(getByText('Data Structures & Algorithms')).toBeTruthy();
  });
});
