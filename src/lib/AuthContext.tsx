import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export interface CustomUser {
  uid: string;
  email: string;
  name?: string;
  phone?: string;
  company?: string;
}

interface AuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  setCustomUser: (u: CustomUser | null) => void;
  logoutCustomer: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  setCustomUser: () => {},
  logoutCustomer: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [customUser, setCustomUser] = useState<CustomUser | null>(() => {
    try {
      const saved = localStorage.getItem('plaza_client_session');
      return saved ? JSON.parse(saved) : null;
    } catch (_e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSetCustomUser = (u: CustomUser | null) => {
    setCustomUser(u);
    if (u) {
      localStorage.setItem('plaza_client_session', JSON.stringify(u));
    } else {
      localStorage.removeItem('plaza_client_session');
    }
  };

  const logoutCustomer = () => {
    handleSetCustomUser(null);
  };

  const activeUser = customUser || (firebaseUser ? {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName || firebaseUser.email,
  } : null);

  return (
    <AuthContext.Provider value={{ 
      user: activeUser, 
      profile: activeUser ? {
        id: activeUser.uid,
        email: activeUser.email,
        displayName: activeUser.name || activeUser.email,
        role: activeUser.email === 'sabeelchakwal@gmail.com' ? 'admin' : 'client',
      } : null, 
      loading, 
      isAdmin: activeUser?.email === 'sabeelchakwal@gmail.com',
      setCustomUser: handleSetCustomUser,
      logoutCustomer,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
