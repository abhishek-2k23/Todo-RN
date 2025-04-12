// frontend/src/screens/Home.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/useTheme';
import Header from '../components/Header';
import CategoryFilter from '../components/CategoryFilter';
import Tasks from '../components/Tasks';
import Categories from '../components/Categories';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Home: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      <CategoryFilter />
      <Tasks />
      <TouchableOpacity 
        style={[styles.createButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('CreateTask')}
      >
        <Text style={[styles.createButtonText, { color: theme.selectedText }]}>
          Create New Task
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 15,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;