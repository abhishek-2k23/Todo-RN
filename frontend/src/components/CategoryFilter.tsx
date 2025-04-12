import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../theme/useTheme';
import { setSelectedCategory } from '../redux/slices/user';

const categories = ['All', 'Work', 'Personal', 'Shopping', 'Health', 'Other'];

const CategoryFilter: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state: any) => state.user.selectedCategory);

  const handleCategoryPress = (category: string) => {
    dispatch(setSelectedCategory(category));
  };

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        { 
          backgroundColor: item === selectedCategory ? theme.primary : theme.card,
          borderColor: theme.border
        }
      ]}
      onPress={() => handleCategoryPress(item)}
    >
      <Text 
        style={[
          styles.categoryText,
          { 
            color: item === selectedCategory ? theme.selectedText : theme.text
          }
        ]}
      >
        {item === 'All' ? '📋 All' : 
         item === 'Work' ? '💼 Work' :
         item === 'Personal' ? '👤 Personal' :
         item === 'Shopping' ? '🛍️ Shopping' :
         item === 'Health' ? '🏥 Health' : '📌 Other'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CategoryFilter; 