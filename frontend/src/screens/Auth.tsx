import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/slices/user';
import { useAppTheme } from '../hooks/useAppTheme';
import { auth } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const navigation = useNavigation<AuthScreenNavigationProp>();

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(''); // Clear any previous errors

    try {
      let response;
      if (isLogin) {
        console.log('Attempting login with:', { email });
        response = await auth.login(email, password);
        console.log('Login response:', response);
      } else {
        console.log('Attempting registration with:', { name, email });
        response = await auth.register(name, email, password);
        console.log('Registration response:', response);
      }

      if (response.token) {
        console.log('Token received, storing in AsyncStorage');
        await AsyncStorage.setItem('token', response.token);
        
        console.log('Fetching user profile...');
        const userData = await auth.getProfile();
        console.log('User profile data:', userData);
        
        console.log('Dispatching user data to Redux');
        dispatch(setUserData(userData));
        
        // Ensure loading screen shows for at least 2 seconds
        setTimeout(() => {
          console.log('Navigating to Home screen');
          navigation.navigate('Home');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Authentication failed';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(''); // Clear error when switching modes
    setName(''); // Clear name field when switching modes
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {isLogin ? 'Login' : 'Register'}
      </Text>

      {!isLogin && (
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border 
          }]}
          placeholder="Name"
          placeholderTextColor={theme.placeholder}
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        style={[styles.input, { 
          backgroundColor: theme.inputBackground,
          color: theme.text,
          borderColor: theme.border 
        }]}
        placeholder="Email"
        placeholderTextColor={theme.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, { 
          backgroundColor: theme.inputBackground,
          color: theme.text,
          borderColor: theme.border 
        }]}
        placeholder="Password"
        placeholderTextColor={theme.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? (
        <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.selectedText} />
        ) : (
          <Text style={[styles.buttonText, { color: theme.selectedText }]}>
            {isLogin ? 'Login' : 'Register'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={switchMode}>
        <Text style={[styles.switchText, { color: theme.text }]}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    textAlign: 'center',
    fontSize: 14,
  },
  error: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
});

export default Auth; 