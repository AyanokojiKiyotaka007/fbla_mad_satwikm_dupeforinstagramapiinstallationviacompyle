import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (userData: Partial<UserProfile> & { password: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get stored users
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Find user with matching email and password
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    }
  };

  const signUp = async (userData: Partial<UserProfile> & { password: string }): Promise<boolean> => {
    try {
      // Get existing users
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Check if email already exists
      if (users.some((u: any) => u.email === userData.email)) {
        return false;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        chapter: userData.chapter || '',
        position: userData.position || 'Member',
        memberSince: new Date().toISOString().split('T')[0],
        eventsAttended: 0,
        bio: userData.bio || '',
        phone: userData.phone || '',
        password: userData.password,
      };

      // Save to users list
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      // Set as current user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error('Error signing up:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      // Update in users list
      const usersData = await AsyncStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        await AsyncStorage.setItem('users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}