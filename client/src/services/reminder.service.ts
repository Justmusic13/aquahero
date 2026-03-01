import api from './api';
import { Reminder } from '@/types';

export const getReminder = async (): Promise<Reminder | null> => {
  const response = await api.get('/reminders');
  return response.data;
};

export const setReminder = async (data: { time: string; isActive: boolean }): Promise<Reminder> => {
  const response = await api.post('/reminders', data);
  return response.data;
};
