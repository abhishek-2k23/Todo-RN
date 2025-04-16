import { Task } from '../types/task';

export type RootStackParamList = {
  Home: undefined;
  CreateTask: {
    onCreateTask: (task: Task) => Promise<void>;
  };
  UserProfile: undefined;
  Auth: undefined;
}; 