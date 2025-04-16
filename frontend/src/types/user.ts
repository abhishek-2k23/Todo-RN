export interface UserData {
  id: string;
  email: string;
  username: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
} 