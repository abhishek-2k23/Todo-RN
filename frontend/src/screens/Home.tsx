import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setTasks } from '../redux/slices/user';
import { todos } from '../services/api';
import CategoryFilter from '../components/CategoryFilter';
import { TaskList } from '../components/TaskList';
import { Task } from '../types/task';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../hooks/useAppTheme';
import Header from '../components/Header';
import Tasks from '../components/Tasks';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Home: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await todos.getAll();
        console.log(response);
        dispatch(setTasks(response));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [dispatch]);

  const handleTaskPress = (_task: Task) => {
    // Handle task press if needed
  };

  const handleCreateTask = async (newTask: Task) => {
    try {
      const response = await todos.create({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        category: newTask.category,
        dueDate: newTask.dueDate
      });
      const updatedTasks = [...tasks, response];
      dispatch(setTasks(updatedTasks));
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      <CategoryFilter />
      <ScrollView style={styles.taskList}>
        <Tasks  />
      </ScrollView>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('CreateTask', { onCreateTask: handleCreateTask })}
      >
        <Text style={[styles.createButtonText, { color: theme.selectedText }]}> Create New Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    
  },
  taskList: {
    flex: 1,
  },
  createButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;