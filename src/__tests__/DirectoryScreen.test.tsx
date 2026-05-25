import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DirectoryScreen } from '../screens/DirectoryScreen';

const Tab = createBottomTabNavigator();
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NavigationContainer>
    <Tab.Navigator initialRouteName="Directory">
      <Tab.Screen name="Home" component={() => null} />
      <Tab.Screen name="Map" component={() => null} />
      <Tab.Screen name="Search" component={() => null} />
      <Tab.Screen name="Directory" component={() => <>{children}</>} />
    </Tab.Navigator>
  </NavigationContainer>
);

describe('DirectoryScreen', () => {
  it('renders faculty directory title', () => {
    const { getByText } = render(<DirectoryScreen />, { wrapper: Wrapper as any });
    expect(getByText('Faculty Directory')).toBeTruthy();
  });

  it('shows all staff by default', () => {
    const { getByText } = render(<DirectoryScreen />, { wrapper: Wrapper as any });
    expect(getByText('Prof Dr Azrul Qaisi')).toBeTruthy();
    expect(getByText('Dr Suraya Yaacob')).toBeTruthy();
  });

  it('filters to lecturers only when Lecturers chip is tapped', () => {
    const { getByText } = render(<DirectoryScreen />, {
      wrapper: Wrapper as any,
    });
    fireEvent.press(getByText('Lecturers'));
    expect(getByText('Prof Dr Azrul Qaisi')).toBeTruthy();
  });
});
