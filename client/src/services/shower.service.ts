import api from './api';
import { ShowerLog } from '@/types';

export const getShowerLogs = async (): Promise<ShowerLog[]> => {
  const response = await api.get('/showers');
  return response.data;
};

export const completeShower = async (data: { startTime: string, durationSeconds: number }): Promise<ShowerLog> => {
  const response = await api.post('/showers/complete', data);
  return response.data;
};
