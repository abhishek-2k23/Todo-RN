// frontend/src/navigation/AppNavigator.tsx

import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import CreateTask from '../screens/CreateTask';
import UserProfile from '../screens/UserProfile';
import Auth from '../screens/Auth';
import { useAppTheme } from '../hooks/useAppTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  CreateTask: undefined;
  UserProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const theme = useAppTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Home" : "Auth"}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen 
        name="Auth" 
        component={Auth}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Home" 
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateTask" 
        component={CreateTask}
        options={{ title: 'Create Task' }}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfile}
        options={{ title: 'User Profile' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;