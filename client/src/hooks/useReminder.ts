import { useState, useEffect } from 'react';
import api from '../services/api';
import { Reminder, ReminderCheckResponse } from '../types';

export const useReminder = () => {
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [shouldShowReminder, setShouldShowReminder] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReminder = async () => {
    try {
      setLoading(true);
      const response = await api.get<Reminder>('/reminders');
      setReminder(response.data);
    } catch (err) {
      console.error('Error fetching reminder:', err);
      setReminder(null);
    } finally {
      setLoading(false);
    }
  };

  const updateReminder = async (reminderTime: string, isActive: boolean) => {
    try {
      const response = await api.put<Reminder>('/reminders', {
        reminderTime,
        isActive,
      });
      setReminder(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating reminder:', err);
      throw err;
    }
  };

  const checkReminder = async () => {
    try {
      const response = await api.get<ReminderCheckResponse>('/reminders/check');
      setShouldShowReminder(response.data.shouldShowReminder);
      return response.data;
    } catch (err) {
      console.error('Error checking reminder:', err);
      return { shouldShowReminder: false, reminderTime: '' };
    }
  };

  useEffect(() => {
    fetchReminder();
    
    // Check reminder every minute
    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    reminder,
    shouldShowReminder,
    loading,
    fetchReminder,
    updateReminder,
    checkReminder,
    setShouldShowReminder,
  };
};
