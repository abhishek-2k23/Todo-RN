// frontend/src/components/Tasks.tsx

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../theme/useTheme';
import { updateTask, deleteTask } from '../redux/slices/user';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category: string;
  completionTime?: string;
  createdAt: string;
  updatedAt: string;
}

const Tasks: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const tasks = useSelector((state: any) => state.user.tasks || []);
  const selectedCategory = useSelector((state: any) => state.user.selectedCategory || 'All');
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  // Debug logging
  React.useEffect(() => {
    console.log('Current tasks:', tasks);
    console.log('Selected category:', selectedCategory);
    console.log('Current theme:', theme);
  }, [tasks, selectedCategory, theme]);

  const filteredTasks = React.useMemo(() => {
    if (selectedCategory === 'All') {
      return tasks;
    }
    return tasks.filter((task: Task) => task.category === selectedCategory);
  }, [tasks, selectedCategory]);

  const handleCompleteTask = (task: Task) => {
    dispatch(updateTask({ ...task, completed: true }));
    setModalVisible(false);
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
    setModalVisible(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#FF4444';
      case 'medium':
        return '#FFBB33';
      case 'low':
        return '#00C851';
      default:
        return theme.text;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[
        styles.taskItem,
        { 
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderWidth: 1,
        }
      ]}
      onPress={() => {
        setSelectedTask(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text 
            style={[
              styles.taskTitle, 
              { color: theme.text },
              item.completed && styles.completedText
            ]}
          >
            {item.title}
          </Text>
          <Text style={[styles.menuText, { color: theme.text }]}>⋮</Text>
        </View>
        <Text style={[styles.taskDescription, { color: theme.textSecondary }]}>
          {item.description}
        </Text>
        <View style={styles.taskFooter}>
          <View style={styles.categoryContainer}>
            <Text style={[styles.categoryText, { color: theme.textSecondary }]}>
              📁 {item.category}
            </Text>
          </View>
          {item.completed && item.completionTime && (
            <Text style={[styles.completionTime, { color: theme.textSecondary }]}>
              ✅ {formatDate(item.completionTime)}
            </Text>
          )}
        </View>
      </View>
      <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(item.priority) }]} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
            📝 No tasks found
          </Text>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => selectedTask && handleCompleteTask(selectedTask)}
            >
              <Text style={[styles.modalOptionText, { color: theme.text }]}>
                ✅ Mark as Completed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => selectedTask && handleDeleteTask(selectedTask.id)}
            >
              <Text style={[styles.modalOptionText, { color: '#FF4444' }]}>
                🗑️ Delete Task
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalOptionText, { color: theme.text }]}>
                ❌ Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  taskItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  taskContent: {
    flex: 1,
    padding: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuText: {
    fontSize: 24,
    lineHeight: 24,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
  },
  completionTime: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  priorityIndicator: {
    width: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 16,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalOptionText: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
  },
});

export default Tasks;