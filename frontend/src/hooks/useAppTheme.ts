import { useColorScheme } from 'react-native';

export const colors = {
  primary: '#1DCD9F',
  primaryDark: '#169976',
  background: '#FFFFFF',
  backgroundDark: '#222222',
  card: '#F5F5F5',
  cardDark: '#2A2A2A',
  text: '#000000',
  textDark: '#CCCCCC',
  textSecondary: '#666666',
  textSecondaryDark: '#AAAAAA',
  border: '#E0E0E0',
  borderDark: '#E0E0E0',
  inputBackground: '#F5F5F5',
  inputBackgroundDark: '#1E1E1E',
  selected: '#1DCD9F',
  selectedText: '#FFFFFF',
  placeholder: '#AAAAAA',
  placeholderDark: '#666666',
  accent: '#E0E0E0',
  accentDark: '#404040',
  error: '#FF4444'
};

export const useAppTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    background: isDark ? colors.backgroundDark : colors.background,
    card: isDark ? colors.cardDark : colors.card,
    text: isDark ? colors.textDark : colors.text,
    textSecondary: isDark ? colors.textSecondaryDark : colors.textSecondary,
    border: isDark ? colors.borderDark : colors.border,
    inputBackground: isDark ? colors.inputBackgroundDark : colors.inputBackground,
    selected: colors.selected,
    selectedText: colors.selectedText,
    placeholder: isDark ? colors.placeholderDark : colors.placeholder,
    accent: isDark ? colors.accentDark : colors.accent,
    error: colors.error
  };
}; 