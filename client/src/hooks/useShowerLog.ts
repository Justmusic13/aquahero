import { useState, useEffect } from 'react';
import api from '../services/api';
import { ShowerLog, ShowerTodayResponse } from '../types';

export const useShowerLog = () => {
  const [showerLogs, setShowerLogs] = useState<ShowerLog[]>([]);
  const [hasShoweredToday, setHasShoweredToday] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchShowerLogs = async (limit = 10, offset = 0) => {
    try {
      setLoading(true);
      const response = await api.get(`/showers?limit=${limit}&offset=${offset}`);
      setShowerLogs(response.data.logs);
    } catch (err) {
      console.error('Error fetching shower logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkTodayShower = async () => {
    try {
      const response = await api.get<ShowerTodayResponse>('/showers/today');
      setHasShoweredToday(response.data.hasShoweredToday);
      return response.data;
    } catch (err) {
      console.error('Error checking today shower:', err);
      return { hasShoweredToday: false };
    }
  };

  const completeShower = async (confirmedBy: 'parent' | 'child' = 'parent') => {
    try {
      const response = await api.post('/showers/complete', { confirmedBy });
      await fetchShowerLogs();
      await checkTodayShower();
      return response.data;
    } catch (err) {
      console.error('Error completing shower:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchShowerLogs();
    checkTodayShower();
  }, []);

  return {
    showerLogs,
    hasShoweredToday,
    loading,
    fetchShowerLogs,
    checkTodayShower,
    completeShower,
  };
};
