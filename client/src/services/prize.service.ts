import api from './api';
import { Prize } from '@/types';

export const getPrizes = async (): Promise<Prize[]> => {
  const response = await api.get('/prizes');
  return response.data;
};

export const createPrize = async (data: {
  title: string;
  description: string;
  pointCost: number;
  imageUrl?: string;
}): Promise<Prize> => {
  const response = await api.post('/prizes', data);
  return response.data;
};

export const updatePrize = async (id: number, data: Partial<Prize>): Promise<Prize> => {
  const response = await api.put(`/prizes/${id}`, data);
  return response.data;
};

export const deletePrize = async (id: number): Promise<void> => {
  await api.delete(`/prizes/${id}`);
};

export const redeemPrize = async (id: number): Promise<{ success: boolean; pointsSpent: number }> => {
  const response = await api.post(`/prizes/${id}/redeem`);
  return response.data;
};
