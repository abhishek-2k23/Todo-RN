import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { colors } from './colors';

export const useTheme = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  return colors[isDarkMode ? 'dark' : 'light'];
}; 