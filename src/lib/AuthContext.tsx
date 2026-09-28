import React, { createContext, useContext, useEffect, useState } from 'react';
import { DataService } from './dataService';

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
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    localStorage.removeItem('plaza_client_session');
    DataService.getCustomerSession().then(session => {
      if (mounted) setUser(session.authenticated ? session.user : null);
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);
  const logoutCustomer = async () => {
    try { await DataService.customerLogout(); setUser(null); }
    catch { alert('Could not sign out. Please try again.'); }
  };
  return <AuthContext.Provider value={{ user, profile: user ? { id: user.uid, email: user.email, displayName: user.name || user.email, role: 'client' } : null, loading, isAdmin: false, setCustomUser: setUser, logoutCustomer }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
