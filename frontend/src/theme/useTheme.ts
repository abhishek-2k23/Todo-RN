import { useSelector } from 'react-redux';

export const useTheme = () => {
  const isDarkMode = useSelector((state: any) => state.user.isDarkMode);

  const lightTheme = {
    primary: '#1DCD9F',
    primaryDark: '#169976',
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    inputBackground: '#F5F5F5',
    selected: '#1DCD9F',
    selectedText: '#FFFFFF',
    placeholder: '#AAAAAA',
  };

  const darkTheme = {
    primary: '#1DCD9F',
    primaryDark: '#169976',
    background: '#222222',
    card: '#2A2A2A',
    text: '#CCCCCC',
    textSecondary: '#AAAAAA',
    border: '#404040',
    inputBackground: '#1E1E1E',
    selected: '#1DCD9F',
    selectedText: '#FFFFFF',
    placeholder: '#666666',
  };

  return isDarkMode ? darkTheme : lightTheme;
}; 