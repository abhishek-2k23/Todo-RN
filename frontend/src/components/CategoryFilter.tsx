import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setSelectedCategory } from '../redux/slices/user';

const CategoryFilter: React.FC = () => {
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const { selectedCategory } = useSelector((state: RootState) => state.user);

  const categories = ['All', 'General', 'Work', 'Personal', 'Shopping', 'Other'];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  selectedCategory === category ? theme.primary : theme.accent,
              },
            ]}
            onPress={() => dispatch(setSelectedCategory(category))}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    selectedCategory === category ? theme.selectedText : theme.text,
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CategoryFilter; 