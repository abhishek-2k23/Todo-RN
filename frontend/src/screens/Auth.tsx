import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/useTheme';

const Auth: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.icon, { color: theme.primary }]}>🔐</Text>
      <Text style={[styles.title, { color: theme.text }]}>Authentication</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, { color: theme.selectedText }]}>
          ← Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Auth; 