import { createContext, useContext } from 'react';
import type { User } from '../types/User';

export interface AuthContextType {
  currentUser: User | null;
  userId: number | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userId: null,
  loading: false,
});

export const useAuthContext = () => useContext(AuthContext);
