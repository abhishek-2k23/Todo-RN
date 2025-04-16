/* eslint-disable react-native/no-inline-styles */
// frontend/src/components/Tasks.tsx

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../hooks/useAppTheme';
import { updateTask, deleteTask } from '../redux/slices/user';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

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
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const tasks = useSelector((state: any) => state.user.tasks || []);
  const selectedCategory = useSelector((state: any) => state.user.selectedCategory || 'All');
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const filteredTasks = React.useMemo(() => {
    if (selectedCategory === 'All') {
      return tasks;
    }
    return tasks.filter((task: Task) => task.category === selectedCategory);
  }, [tasks, selectedCategory]);

  const handleCompleteTask = (task: Task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: new Date().toISOString()
    };
    dispatch(updateTask(updatedTask));
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
    setModalVisible(false);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
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

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[
        styles.taskItem,
        {
          backgroundColor: theme.card,
          borderLeftColor: getPriorityColor(item.priority),
        },
      ]}
      onPress={() => {
        setSelectedTask(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>

          {/* //bouncy check box  */}
          <BouncyCheckbox
            size={25}
            fillColor={getPriorityColor(item.priority)}

            // item title 
            text={item.title}
            iconStyle={{ borderColor: getPriorityColor(item.priority) }}
            innerIconStyle={{ borderWidth: 2 }}
            textStyle={[
              styles.taskTitle,
              { color: theme.text },
              item.completed && styles.completedText,
            ]}
            isChecked={item.completed}
            onPress={() => handleCompleteTask(item)}
          />

          {/* three dot option menu  */}
          <TouchableOpacity onPress={() => {
            setSelectedTask(item);
            setModalVisible(true);
          }}>
            <Text style={[styles.menuText, { color: theme.text }]}>⋮</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.taskFooter}>
          {item.dueDate ? <Text style={[styles.dueDate, { color: theme.textSecondary }]}>
            📅 {formatDate(item.dueDate)}
          </Text> : <Text> </Text>}
          <Text style={[styles.category, { color: theme.textSecondary }]}>
            📁 {item.category}
          </Text>
        </View>
      </View>
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
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.inputBackground }]}>
            {selectedTask && (
              <>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {selectedTask.title}
                </Text>
                <Text style={[styles.modalDescription, { color: theme.text }]}>
                  {selectedTask.description}
                </Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                    onPress={() => handleDeleteTask(selectedTask.id)}
                  >
                    <Text style={[styles.actionButtonText, { color: theme.selectedText }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
    padding: 2,
    paddingHorizontal: 5,
  },
  taskItem: {
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskContent: {
    padding: 10,
    paddingRight: 16,
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
    marginTop: 8,
  },
  dueDate: {
    fontSize: 12,
  },
  category: {
    fontSize: 12,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    padding: 10,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Tasks;
