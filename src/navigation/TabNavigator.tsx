import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { MapScreen } from '../screens/MapScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { DirectoryScreen } from '../screens/DirectoryScreen';
import { colors } from '../theme';

export type TabParamList = {
  Home: undefined;
  Map: { destinationId?: string } | undefined;
  Search: undefined;
  Directory: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  Map: 'map-outline',
  Search: 'search-outline',
  Directory: 'grid-outline',
};

export const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, size }) => (
        <Ionicons
          name={ICONS[route.name as keyof TabParamList]}
          size={size}
          color={focused ? colors.primary : colors.textSecondary}
        />
      ),
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarStyle: {
        backgroundColor: colors.card,
        borderTopColor: colors.border,
        paddingBottom: 4,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Directory" component={DirectoryScreen} />
  </Tab.Navigator>
);
