/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import {setUserData, setTasks} from './src/redux/slices/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, ActivityIndicator} from 'react-native';
import {colors} from './src/hooks/useAppTheme';

const LoadingView = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    }}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for token in AsyncStorage
        const token = await AsyncStorage.getItem('token');
        const storedTasks = await AsyncStorage.getItem('tasks');

        if (token) {
          // If token exists, set user data
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            store.dispatch(setUserData(JSON.parse(userData)));
          }
        }

        // Set tasks from AsyncStorage if they exist
        if (storedTasks) {
          store.dispatch(setTasks(JSON.parse(storedTasks)));
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingView />;
  }

  return <AppNavigator />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
