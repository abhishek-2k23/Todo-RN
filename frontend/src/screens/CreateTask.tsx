import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  ScrollView,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, addCategory } from '../redux/slices/user';
import type { RootState } from '../redux/store';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../theme/useTheme';

type CreateTaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateTask'>;

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  priority: PriorityLevel;
  dueDate?: string;
}

interface Category {
  id: string;
  name: string;
}

const CreateTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [priority, setPriority] = useState<PriorityLevel>(PriorityLevel.LOW);
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dispatch = useDispatch();
  const navigation = useNavigation<CreateTaskScreenNavigationProp>();
  const categories = useSelector((state: RootState) => state.user.categories);
  const theme = useTheme();

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      category,
      completed: false,
      priority,
      dueDate: dueDate || undefined,
    };
    dispatch(addTask(newTask));
    navigation.goBack();
  };

  const handleAddCategory = () => {
    if (newCategory) {
      const newCategoryObj: Category = {
        id: Date.now().toString(),
        name: newCategory,
      };
      dispatch(addCategory(newCategoryObj));
      setCategory(newCategory);
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      setDueDate(adjustedDate.toISOString().split('T')[0]);
    }
  };

  const priorityData = [
    { level: PriorityLevel.LOW, label: 'Low Priority' },
    { level: PriorityLevel.MEDIUM, label: 'Medium Priority' },
    { level: PriorityLevel.HIGH, label: 'High Priority' },
    { level: PriorityLevel.URGENT, label: 'Urgent Priority' },
  ];

  const renderPriorityItem = ({ item }: { item: { level: PriorityLevel; label: string } }) => (
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
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Create Task</Text>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={[
            styles.input,
            { 
              color: theme.text,
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              borderWidth: 1,
            }
          ]}
          placeholder="Title"
          placeholderTextColor={theme.placeholder}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[
            styles.input,
            styles.descriptionInput,
            { 
              color: theme.text,
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              borderWidth: 1,
            }
          ]}
          placeholder="Description"
          placeholderTextColor={theme.placeholder}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <View style={styles.dateInputContainer}>
          <TextInput
            style={[
              styles.input,
              styles.dateInput,
              { 
                color: theme.text,
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                borderWidth: 1,
              }
            ]}
            placeholder="Due Date (YYYY-MM-DD)"
            placeholderTextColor={theme.placeholder}
            value={dueDate}
            editable={false}
          />
          <TouchableOpacity 
            style={[
              styles.calendarButton,
              { 
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
              }
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Select Category
          </Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  category === item.name && styles.selectedCategory,
                  { 
                    backgroundColor: category === item.name ? theme.selected : theme.card,
                    borderColor: theme.border,
                    borderWidth: 1,
                  }
                ]}
                onPress={() => setCategory(item.name)}
              >
                <Text style={[
                  styles.categoryText,
                  { 
                    color: category === item.name ? theme.selectedText : theme.text
                  }
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            ListFooterComponent={
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  { 
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderWidth: 1,
                  }
                ]}
                onPress={() => setShowNewCategory(true)}
              >
                <Text style={[styles.categoryText, { color: theme.text }]}>
                  Create New Category
                </Text>
              </TouchableOpacity>
            }
          />
        </View>

        {showNewCategory && (
          <View style={styles.newCategoryContainer}>
            <TextInput
              style={[
                styles.input,
                { 
                  color: theme.text,
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  borderWidth: 1,
                }
              ]}
              placeholder="New Category Name"
              placeholderTextColor={theme.placeholder}
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleAddCategory}
            >
              <Text style={styles.buttonText}>Add Category</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Select Priority
          </Text>
          <FlatList
            data={priorityData}
            renderItem={renderPriorityItem}
            keyExtractor={(item) => item.level}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleAddTask}
        >
          <Text style={styles.submitButtonText}>Create Task</Text>
        </TouchableOpacity>
      </ScrollView>
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
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 16,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  newCategoryContainer: {
    marginBottom: 24,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  priorityItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedPriority: {
    backgroundColor: '#007AFF',
  },
  priorityText: {
    fontSize: 16,
  },
  selectedPriorityText: {
    color: '#FFFFFF',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
    marginRight: 8,
  },
  calendarButton: {
    padding: 8,
    borderRadius: 12,
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateTask; 