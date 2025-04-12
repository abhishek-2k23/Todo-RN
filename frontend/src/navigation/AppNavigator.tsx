// frontend/src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import CreateTask from '../screens/CreateTask';
import UserProfile from '../screens/UserProfile';
import Auth from '../screens/Auth';

export type RootStackParamList = {
  Home: undefined;
  CreateTask: undefined;
  UserProfile: undefined;
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShown: false
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{
            title: 'Todo App',
          }}
        />
        <Stack.Screen 
          name="CreateTask" 
          component={CreateTask}
        />
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfile}
        />
        <Stack.Screen 
          name="Auth" 
          component={Auth}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;