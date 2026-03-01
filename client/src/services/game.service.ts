import api from './api';
import { GameStatus, GameScoreResponse } from '@/types';

export const getGameStatus = async (): Promise<GameStatus> => {
  const response = await api.get('/games/status');
  return response.data;
};

export const submitScore = async (
  score: number,
  gameType: string,
  durationSeconds: number
): Promise<GameScoreResponse> => {
  const response = await api.post('/games/score', { score, gameType, durationSeconds });
  return response.data;
};
