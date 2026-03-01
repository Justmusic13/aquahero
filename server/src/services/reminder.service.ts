import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { Reminder } from '../types';
import { hasShoweredToday } from './shower.service';

export const getReminder = async (profileId: string): Promise<Reminder> => {
  const res = await query('SELECT reminder_time, is_active FROM reminders WHERE profile_id = $1', [profileId]);
  if (res.rows.length === 0) {
    // Create a default reminder if none exists
    const defaultRes = await query(
      "INSERT INTO reminders (profile_id, reminder_time, is_active) VALUES ($1, '19:00:00', false) RETURNING reminder_time, is_active",
      [profileId]
    );
    return {
      reminderTime: defaultRes.rows[0].reminder_time,
      isActive: defaultRes.rows[0].is_active,
    };
  }
  return {
    reminderTime: res.rows[0].reminder_time,
    isActive: res.rows[0].is_active,
  };
};

export const updateReminder = async (profileId: string, data: Reminder): Promise<Reminder> => {
  const { reminderTime, isActive } = data;
  const res = await query(
    `INSERT INTO reminders (profile_id, reminder_time, is_active) 
     VALUES ($1, $2, $3) 
     ON CONFLICT (profile_id) 
     DO UPDATE SET reminder_time = $2, is_active = $3, updated_at = NOW()
     RETURNING reminder_time, is_active`,
    [profileId, reminderTime, isActive]
  );
  return {
    reminderTime: res.rows[0].reminder_time,
    isActive: res.rows[0].is_active,
  };
};

export const checkReminder = async (profileId: string) => {
  const reminder = await getReminder(profileId);
  if (!reminder.isActive) {
    return { shouldShowReminder: false, reminderTime: reminder.reminderTime };
  }

  const showeredToday = await hasShoweredToday(profileId);
  if (showeredToday.hasShoweredToday) {
    return { shouldShowReminder: false, reminderTime: reminder.reminderTime };
  }

  const [reminderHour, reminderMinute] = reminder.reminderTime.split(':').map(Number);
  const now = new Date();
  // Assuming server is in UTC, adjust as needed for specific timezones
  const currentHour = now.getUTCHours();
  const currentMinute = now.getUTCMinutes();

  const isTime = currentHour > reminderHour || (currentHour === reminderHour && currentMinute >= reminderMinute);
  
  return {
    shouldShowReminder: isTime,
    reminderTime: reminder.reminderTime,
  };
};
