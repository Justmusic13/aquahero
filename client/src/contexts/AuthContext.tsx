import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Profile } from '@/types';
import * as profileService from '@/services/profile.service';

interface AuthContextType {
  isAuthenticated: boolean;
  profile: Profile | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  reloadProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userProfile = await profileService.getProfile();
          setProfile(userProfile);
        } catch (error) {
          console.error('Failed to fetch profile, logging out.', error);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = async (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const userProfile = await profileService.getProfile();
    setProfile(userProfile);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setProfile(null);
  };

  const reloadProfile = async () => {
    if (token) {
      try {
        const userProfile = await profileService.getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to reload profile', error);
      }
    }
  };

  const value = {
    isAuthenticated: !!token && !!profile,
    profile,
    token,
    loading,
    login,
    logout,
    reloadProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
