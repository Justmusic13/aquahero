import api from './api';
import { LeaderboardEntry } from '@/types';

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const response = await api.get('/leaderboard');
  return response.data;
};