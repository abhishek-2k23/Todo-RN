import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

const LoadingScreen: React.FC = () => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen; 