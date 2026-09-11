import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { storageService, notifyDatabaseChange } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  isOwner: boolean;
  isCustomer: boolean;
  loginCustomer: (email: string, name?: string) => Promise<{ success: boolean; message?: string }>;
  registerCustomer: (data: { name: string; email: string; phone: string; address?: string }) => Promise<{ success: boolean; message?: string }>;
  loginOwner: (usernameOrEmail: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  quickLoginDemoCustomer: () => void;
  quickLoginDemoOwner: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storageService.getActiveUser());

  useEffect(() => {
    const handleDbChange = () => {
      setCurrentUser(storageService.getActiveUser());
    };
    window.addEventListener('grand_horizon_db_change', handleDbChange);
    return () => window.removeEventListener('grand_horizon_db_change', handleDbChange);
  }, []);

  const isOwner = currentUser?.role === 'HOTEL_OWNER' || currentUser?.role === 'ADMIN';
  const isCustomer = currentUser?.role === 'CUSTOMER';

  const loginCustomer = async (email: string, name?: string): Promise<{ success: boolean; message?: string }> => {
    const users = storageService.getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    
    if (!user) {
      // Auto-create customer if logging in for first time with email
      user = {
        id: `cust-${Date.now()}`,
        name: name || email.split('@')[0],
        email: email.trim().toLowerCase(),
        phone: '+1 (555) 000-0000',
        role: 'CUSTOMER',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      storageService.saveUsers(users);
    }

    storageService.setActiveUser(user);
    setCurrentUser(user);
    return { success: true };
  };

  const registerCustomer = async (data: { name: string; email: string; phone: string; address?: string }): Promise<{ success: boolean; message?: string }> => {
    const users = storageService.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email address already exists. Please log in.' };
    }

    const newUser: User = {
      id: `cust-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      address: data.address?.trim() || '',
      role: 'CUSTOMER',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storageService.saveUsers(users);
    storageService.setActiveUser(newUser);
    setCurrentUser(newUser);
    return { success: true };
  };

  const loginOwner = async (usernameOrEmail: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const cleanId = usernameOrEmail.trim().toLowerCase();
    // Verify owner credentials (supports admin@grandhorizon.com, owner, admin)
    const isOwnerMatch = cleanId === 'admin@grandhorizon.com' || cleanId === 'admin' || cleanId === 'owner' || cleanId.includes('grandhorizon.com');
    
    if (!isOwnerMatch) {
      return { success: false, message: 'Invalid hotel owner credentials. Use "admin@grandhorizon.com" or the Demo Login.' };
    }

    // Pass can be admin123, or any test password for prototype
    const ownerUser: User = {
      id: 'owner-01',
      name: 'Robert Vance (Owner & GM)',
      email: 'admin@grandhorizon.com',
      phone: '+1 (800) 555-4726',
      address: 'Grand Horizon Executive Suite, Marina Bay',
      role: 'HOTEL_OWNER',
      hotelId: 'hotel-grand-horizon',
      createdAt: '2026-01-01T00:00:00.000Z'
    };

    storageService.setActiveUser(ownerUser);
    setCurrentUser(ownerUser);
    return { success: true };
  };

  const logout = () => {
    storageService.setActiveUser(null);
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...data };
    storageService.setActiveUser(updated);
    setCurrentUser(updated);

    const users = storageService.getUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx >= 0) {
      users[idx] = updated;
      storageService.saveUsers(users);
    }
  };

  const quickLoginDemoCustomer = () => {
    const demoCust: User = {
      id: 'cust-01',
      name: 'Alexander Hayes',
      email: 'alex.hayes@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, San Francisco, CA',
      role: 'CUSTOMER',
      createdAt: '2026-09-08T00:00:00.000Z'
    };
    storageService.setActiveUser(demoCust);
    setCurrentUser(demoCust);
  };

  const quickLoginDemoOwner = () => {
    const demoOwner: User = {
      id: 'owner-01',
      name: 'Robert Vance (Owner & GM)',
      email: 'admin@grandhorizon.com',
      phone: '+1 (800) 555-4726',
      address: 'Grand Horizon Executive Suite, Marina Bay',
      role: 'HOTEL_OWNER',
      hotelId: 'hotel-grand-horizon',
      createdAt: '2026-01-01T00:00:00.000Z'
    };
    storageService.setActiveUser(demoOwner);
    setCurrentUser(demoOwner);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isOwner,
        isCustomer,
        loginCustomer,
        registerCustomer,
        loginOwner,
        logout,
        updateProfile,
        quickLoginDemoCustomer,
        quickLoginDemoOwner
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
