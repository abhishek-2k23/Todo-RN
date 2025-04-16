// frontend/src/components/Header.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../hooks/useAppTheme';
import { toggleTheme } from '../redux/slices/theme';

type HeaderNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header: React.FC = () => {
  const navigation = useNavigation<HeaderNavigationProp>();
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user.userData);
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

  const userInitials = userData?.name ? userData.name.charAt(0).toUpperCase() : 'U';

  const handleUserPress = () => {
    if (userData) {
      navigation.navigate('UserProfile');
    } else {
      navigation.navigate('Auth');
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={styles.themeToggle}
        onPress={handleThemeToggle}
      >
        <Text style={[styles.themeText, { color: theme.text }]}>
          {isDarkMode ? '☀️' : '🌙'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.appName, { color: theme.text }]}>Todo App</Text>

      <TouchableOpacity
        style={[styles.userIconContainer, { backgroundColor: theme.primary }]}
        onPress={handleUserPress}
      >
        <Text style={[styles.userIcon, { color: theme.selectedText }]}>
          {userInitials}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  themeToggle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeText: {
    fontSize: 24,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  userIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;