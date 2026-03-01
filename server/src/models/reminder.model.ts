import { query } from '../config/database';

export interface Reminder {
  id: number;
  profile_id: string;
  reminder_time: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export const createOrUpdateReminder = async (
  profileId: string,
  reminderTime: string,
  isActive: boolean
): Promise<Reminder> => {
  const result = await query(
    `INSERT INTO reminders (profile_id, reminder_time, is_active) 
     VALUES ($1, $2, $3) 
     ON CONFLICT (profile_id) 
     DO UPDATE SET reminder_time = $2, is_active = $3, updated_at = NOW() 
     RETURNING *`,
    [profileId, reminderTime, isActive]
  );
  return result.rows[0];
};

export const getReminderByProfileId = async (profileId: string): Promise<Reminder | null> => {
  const result = await query('SELECT * FROM reminders WHERE profile_id = $1', [profileId]);
  return result.rows[0] || null;
};
