import api from './api';
import { GameScoreResponse } from '../types';

export const gameService = {
  async submitScore(gameType: string, score: number): Promise<GameScoreResponse> {
    const response = await api.post('/games/score', { gameType, score });
    return response.data;
  },

  async getHighScores(gameType: string) {
    const response = await api.get(`/games/highscores/${gameType}`);
    return response.data;
  },
};
