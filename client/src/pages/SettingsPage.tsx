import React, { useState, useEffect } from 'react';
import * as reminderService from '@/services/reminder.service';
import { Reminder } from '@/types';

const SettingsPage: React.FC = () => {
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [time, setTime] = useState('08:00');
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchReminder = async () => {
      try {
        const data = await reminderService.getReminder();
        if (data) {
          setReminder(data);
          setTime(data.reminder_time.substring(0, 5)); // "HH:MM:SS" -> "HH:MM"
          setIsActive(data.is_active);
        }
      } catch (error) {
        console.error('Failed to fetch reminder settings', error);
      }
    };
    fetchReminder();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const updatedReminder = await reminderService.setReminder({
        time: `${time}:00`,
        isActive,
      });
      setReminder(updatedReminder);
      setMessage('Reminder settings saved successfully!');
    } catch (error) {
      console.error('Failed to save reminder settings', error);
      setMessage('Error saving settings.');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <h3>Shower Reminder</h3>
        <p>Set a daily reminder for your shower time.</p>
        <div>
          <label htmlFor="reminderTime">Reminder Time</label>
          <input
            id="reminderTime"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              style={{ width: 'auto', marginBottom: 0 }}
            />
            Enable Reminder
          </label>
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Save Settings</button>
        {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      </form>
    </div>
  );
};

export default SettingsPage;
