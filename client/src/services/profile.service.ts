import api from './api';
import { Profile } from '@/types';

export const getProfile = async (): Promise<Profile> => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateProfile = async (data: {
  childName?: string;
  avatarId?: number;
  themeColor?: string;
}): Promise<Profile> => {
  const response = await api.put('/profile', data);
  return response.data;
};
