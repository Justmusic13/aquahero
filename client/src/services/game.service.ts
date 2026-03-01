import api from './api';

export const submitScore = async (score: number): Promise<{ pointsEarned: number }> => {
  const response = await api.post('/games/score', { score });
  return response.data;
};
