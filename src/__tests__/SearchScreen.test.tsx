import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SearchScreen } from '../screens/SearchScreen';

const Tab = createBottomTabNavigator();
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NavigationContainer>
    <Tab.Navigator initialRouteName="Search">
      <Tab.Screen name="Home" component={() => null} />
      <Tab.Screen name="Map" component={() => null} />
      <Tab.Screen name="Search" component={() => <>{children}</>} />
      <Tab.Screen name="Directory" component={() => null} />
    </Tab.Navigator>
  </NavigationContainer>
);

describe('SearchScreen', () => {
  it('renders all locations and staff by default', () => {
    const { getByText } = render(<SearchScreen />, { wrapper: Wrapper as any });
    expect(getByText('AI Lab 01')).toBeTruthy();
    expect(getByText('Prof Dr Azrul Qaisi')).toBeTruthy();
  });

  it('filters results when user types a query', () => {
    const { getByPlaceholderText, queryByText, getByText } = render(<SearchScreen />, {
      wrapper: Wrapper as any,
    });
    fireEvent.changeText(
      getByPlaceholderText('Search rooms, labs, or staff...'),
      'ai lab',
    );
    expect(getByText('AI Lab 01')).toBeTruthy();
    expect(queryByText('DK1 Lecture Hall')).toBeNull();
  });
});
