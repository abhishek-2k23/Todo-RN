import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {Task, Priority} from '../types/task';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useAppTheme} from '../hooks/useAppTheme';

type CreateTaskScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateTask'
>;
type CreateTaskScreenRouteProp = RouteProp<RootStackParamList, 'CreateTask'>;

const CreateTask: React.FC = () => {
  const navigation = useNavigation<CreateTaskScreenNavigationProp>();
  const route = useRoute<CreateTaskScreenRouteProp>();
  const theme = useAppTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState<Priority>('low');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleCreateTask = async () => {
    if (!title.trim()) {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: dueDate,
    };

    try {
      if (route.params?.onCreateTask) {
        await route.params.onCreateTask(newTask);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const adjustedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
      );
      setDueDate(adjustedDate.toISOString().split('T')[0]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const priorityData: {label: string; value: Priority}[] = [
    {label: '🟢 Low', value: 'low'},
    {label: '🟡 Medium', value: 'medium'},
    {label: '🔴 High', value: 'high'},
  ];

  const categories = ['General', 'Work', 'Personal', 'Shopping', 'Other'];

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.background}]}>
      <Text style={[styles.title, {color: theme.text}]}>Create New Task</Text>

      <TextInput
        style={[
          styles.input,
          {backgroundColor: theme.accent, color: theme.text},
        ]}
        placeholder="Title"
        placeholderTextColor={theme.textSecondary}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[
          styles.input,
          styles.textArea,
          {backgroundColor: theme.accent, color: theme.text},
        ]}
        placeholder="Description"
        placeholderTextColor={theme.textSecondary}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <View
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <Text style={[styles.label, {color: theme.text}]}>Due Date</Text>
        <TouchableOpacity
          style={[styles.dateButton, {backgroundColor: theme.card}]}
          onPress={() => setShowDatePicker(true)}>
          <Text style={[styles.dateText, {color: theme.text}]}>
            📅 {dueDate ? formatDate(dueDate) : 'Select date'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, {color: theme.text}]}>Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  category === cat ? theme.primary : theme.accent,
              },
            ]}
            onPress={() => setCategory(cat)}>
            <Text
              style={[
                styles.categoryButtonText,
                {
                  color: category === cat ? theme.selectedText : theme.text,
                },
              ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, {color: theme.text}]}>Priority</Text>
      <View style={styles.priorityContainer}>
        {priorityData.map(item => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.priorityButton,
              {
                backgroundColor:
                  priority === item.value ? theme.primary : theme.accent,
              },
            ]}
            onPress={() => setPriority(item.value)}>
            <Text
              style={[
                styles.priorityButtonText,
                {
                  color:
                    priority === item.value ? theme.selectedText : theme.text,
                },
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.accent}]}
          onPress={() => navigation.goBack()}>
          <Text style={[styles.buttonText, {color: theme.text}]}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.primary}]}
          onPress={handleCreateTask}>
          <Text style={[styles.buttonText, {color: theme.selectedText}]}>
            Create
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryButtonText: {
    fontSize: 14,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateTask;
