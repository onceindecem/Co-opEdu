import { createContext, useContext } from 'react';

type AuthContextType = {
  user: any;        
  profile: any;   
  loading: boolean;
  checkAuth: () => Promise<string | null>; 
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  checkAuth: async () => null,
});

export const useAuth = () => useContext(AuthContext);