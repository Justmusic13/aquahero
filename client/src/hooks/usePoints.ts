import { useState, useEffect } from 'react';
import api from '../services/api';
import { PointsResponse, AwardPointsResponse } from '../types';

export const usePoints = () => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoints = async () => {
    try {
      setLoading(true);
      const response = await api.get<PointsResponse>('/points');
      setPoints(response.data.totalPoints);
      setError(null);
    } catch (err) {
      setError('Failed to fetch points');
      console.error('Error fetching points:', err);
    } finally {
      setLoading(false);
    }
  };

  const awardPoints = async (pointsToAward: number, reason: string) => {
    try {
      const response = await api.post<AwardPointsResponse>('/points/award', {
        points: pointsToAward,
        reason,
      });
      setPoints(response.data.newTotal);
      return response.data;
    } catch (err) {
      setError('Failed to award points');
      console.error('Error awarding points:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return {
    points,
    loading,
    error,
    fetchPoints,
    awardPoints,
  };
};
