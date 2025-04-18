import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/slices/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { UserData } from '../types/user';

type UserProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserProfile'>;

const UserProfile: React.FC = () => {
  const navigation = useNavigation<UserProfileNavigationProp>();
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user.userData);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
      dispatch(setUserData({} as UserData));
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {userData ? (
          <>
            <View style={styles.profileSection}>
              <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
                <Text style={[styles.avatarText, { color: theme.selectedText }]}>
                  {userData.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.name, { color: theme.text }]}>{userData.name}</Text>
              <Text style={[styles.email, { color: theme.textSecondary }]}>{userData.email}</Text>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Text style={[styles.iconText, { color: theme.textSecondary }]}>👤</Text>
                <Text style={[styles.infoText, { color: theme.text }]}>Username: {userData.username}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={[styles.iconText, { color: theme.textSecondary }]}>📧</Text>
                <Text style={[styles.infoText, { color: theme.text }]}>Email: {userData.email}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: theme.primary }]}
              onPress={handleLogout}
            >
              <Text style={[styles.iconText, { color: theme.selectedText }]}>🚪</Text>
              <Text style={[styles.logoutText, { color: theme.selectedText }]}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.authSection}>
            <Text style={[styles.authTitle, { color: theme.text }]}>Not Logged In</Text>
            <Text style={[styles.authSubtitle, { color: theme.textSecondary }]}>
              Please login to access your profile
            </Text>
            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate('Auth')}
            >
              <Text style={[styles.authButtonText, { color: theme.selectedText }]}>
                Login / Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  iconText: {
    fontSize: 24,
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  authSection: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  authButton: {
    padding: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfile; 