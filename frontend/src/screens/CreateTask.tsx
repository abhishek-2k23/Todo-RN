import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  ScrollView,
  Platform,
  Modal
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../redux/slices/user';
import type { RootState } from '../redux/store';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../theme/useTheme';

type CreateTaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateTask'>;

type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

const CreateTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('low');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation<CreateTaskScreenNavigationProp>();
  const categories = useSelector((state: RootState) => state.user.categories);
  const theme = useTheme();

  const handleAddTask = () => {
    if (!title.trim()) {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category: category || 'Other',
      completed: false,
      priority,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch(addTask(newTask));
    navigation.goBack();
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      setDueDate(adjustedDate.toISOString().split('T')[0]);
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

  const priorityData = [
    { level: 'low' as Priority, label: 'Low Priority' },
    { level: 'medium' as Priority, label: 'Medium Priority' },
    { level: 'high' as Priority, label: 'High Priority' },
  ];

  const renderPriorityItem = ({ item }: { item: { level: Priority; label: string } }) => (
    <TouchableOpacity
      style={[
        styles.priorityItem,
        priority === item.level && styles.selectedPriority,
        { 
          backgroundColor: priority === item.level ? theme.selected : theme.card,
          borderColor: theme.border,
          borderWidth: 1,
        }
      ]}
      onPress={() => setPriority(item.level)}
    >
      <Text style={[
        styles.priorityText,
        { 
          color: priority === item.level ? theme.selectedText : theme.text
        }
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.text }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Create Task</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
          <Text style={[styles.label, { color: theme.text }]}>Title</Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Enter task title"
            placeholderTextColor={theme.placeholder}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
          <Text style={[styles.label, { color: theme.text }]}>Description</Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Enter task description"
            placeholderTextColor={theme.placeholder}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
          <Text style={[styles.label, { color: theme.text }]}>Due Date</Text>
          <TouchableOpacity
            style={[styles.dateButton, { backgroundColor: theme.card }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, { color: theme.text }]}>
              📅 {dueDate ? formatDate(dueDate) : 'Select date'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
          <Text style={[styles.label, { color: theme.text }]}>Priority</Text>
          <FlatList
            data={priorityData}
            renderItem={renderPriorityItem}
            keyExtractor={(item) => item.level}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.priorityList}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
          <Text style={[styles.label, { color: theme.text }]}>Category</Text>
          <TouchableOpacity
            style={[styles.categoryButton, { backgroundColor: theme.card }]}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text style={[styles.categoryText, { color: theme.text }]}>
              📁 {category || 'Select category'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.primary }]}
          onPress={handleAddTask}
        >
          <Text style={[styles.createButtonText, { color: theme.selectedText }]}>
            Create Task
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showCategoryPicker && (
        <Modal
          visible={showCategoryPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCategoryPicker(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select Category</Text>
              {categories.map((cat: Category) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryOption,
                    { backgroundColor: category === cat.name ? theme.selected : theme.card }
                  ]}
                  onPress={() => {
                    setCategory(cat.name);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    { color: category === cat.name ? theme.selectedText : theme.text }
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  dateButton: {
    height: 50,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  priorityList: {
    padding: 16,
  },
  priorityItem: {
    padding: 16,
    borderRadius: 12,
    marginRight: 8,
  },
  selectedPriority: {
    backgroundColor: '#007AFF',
  },
  priorityText: {
    fontSize: 16,
  },
  categoryButton: {
    height: 50,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 16,
  },
  createButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryOption: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryOptionText: {
    fontSize: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CreateTask; 