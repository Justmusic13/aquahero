import React, { useState, useEffect } from 'react';
import * as reminderService from '@/services/reminder.service';
import * as prizeService from '@/services/prize.service';
import { Prize, ThemeColor } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import ThemePicker from '@/components/ThemePicker';

const SettingsPage: React.FC = () => {
  const { themeColor, setTheme } = useAuth();

  // Reminder state
  const [time, setTime] = useState('08:00');
  const [isActive, setIsActive] = useState(true);
  const [reminderMsg, setReminderMsg] = useState('');

  // Prize state
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [newPrize, setNewPrize] = useState({ title: '', description: '', pointCost: 100, imageUrl: '' });
  const [prizeMsg, setPrizeMsg] = useState('');
  const [showPrizeForm, setShowPrizeForm] = useState(false);

  useEffect(() => {
    fetchReminder();
    fetchPrizes();
  }, []);

  const fetchReminder = async () => {
    try {
      const data = await reminderService.getReminder();
      if (data) {
        setTime(data.reminder_time?.substring(0, 5) || '08:00');
        setIsActive(data.is_active);
      }
    } catch (error) {
      console.error('Failed to fetch reminder', error);
    }
  };

  const fetchPrizes = async () => {
    try {
      const data = await prizeService.getPrizes();
      setPrizes(data);
    } catch (error) {
      console.error('Failed to fetch prizes', error);
    }
  };

  const handleReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReminderMsg('');
    try {
      await reminderService.setReminder({ time: `${time}:00`, isActive });
      setReminderMsg('Reminder saved! ✅');
      setTimeout(() => setReminderMsg(''), 3000);
    } catch (error) {
      setReminderMsg('Error saving settings.');
    }
  };

  const handleAddPrize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrize.title || !newPrize.pointCost) return;
    try {
      await prizeService.createPrize({
        title: newPrize.title,
        description: newPrize.description,
        pointCost: newPrize.pointCost,
        imageUrl: newPrize.imageUrl || undefined,
      });
      setPrizeMsg('Prize added! 🎉');
      setNewPrize({ title: '', description: '', pointCost: 100, imageUrl: '' });
      setShowPrizeForm(false);
      await fetchPrizes();
      setTimeout(() => setPrizeMsg(''), 3000);
    } catch (error: any) {
      setPrizeMsg(error.response?.data?.error || 'Failed to add prize');
    }
  };

  const handleDeletePrize = async (id: number) => {
    try {
      await prizeService.deletePrize(id);
      await fetchPrizes();
    } catch (error) {
      console.error('Failed to delete prize', error);
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>⚙️ Settings</h2>

      {/* Theme Section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0 }}>🎨 Color Theme</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Pick your favorite color scheme!</p>
        <ThemePicker
          currentTheme={themeColor}
          onSelect={(theme: ThemeColor) => setTheme(theme)}
        />
      </div>

      {/* Reminder Section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0 }}>🔔 Shower Reminder</h3>
        <p style={{ color: 'var(--text-muted)' }}>
          Set a daily reminder. Shower within 45 minutes of reminder time for a <strong>50 point bonus!</strong> 🔥
        </p>
        <form onSubmit={handleReminderSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="reminderTime" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Reminder Time
            </label>
            <input
              id="reminderTime"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: 'auto', marginBottom: 0 }}
              />
              Enable Reminder
            </label>
          </div>
          <button type="submit" style={{ borderRadius: '12px' }}>Save Reminder</button>
          {reminderMsg && <p style={{ color: 'green', marginTop: '0.5rem', fontWeight: 'bold' }}>{reminderMsg}</p>}
        </form>
      </div>

      {/* Prizes Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>🏆 Prizes ({prizes.length}/10)</h3>
          {prizes.length < 10 && (
            <button
              onClick={() => setShowPrizeForm(!showPrizeForm)}
              style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', borderRadius: '8px' }}
            >
              {showPrizeForm ? 'Cancel' : '+ Add Prize'}
            </button>
          )}
        </div>

        <p style={{ color: 'var(--text-muted)', marginTop: 0 }}>
          Set up prizes that can be earned with AquaHero points!
        </p>

        {prizeMsg && <p style={{ color: 'green', fontWeight: 'bold' }}>{prizeMsg}</p>}

        {/* Add prize form */}
        {showPrizeForm && (
          <form
            onSubmit={handleAddPrize}
            style={{
              background: 'var(--background-color)',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1rem',
            }}
          >
            <input
              type="text"
              placeholder="Prize title (e.g., 'Extra Screen Time')"
              value={newPrize.title}
              onChange={(e) => setNewPrize({ ...newPrize, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newPrize.description}
              onChange={(e) => setNewPrize({ ...newPrize, description: e.target.value })}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Point Cost</label>
                <input
                  type="number"
                  min="1"
                  value={newPrize.pointCost}
                  onChange={(e) => setNewPrize({ ...newPrize, pointCost: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={newPrize.imageUrl}
              onChange={(e) => setNewPrize({ ...newPrize, imageUrl: e.target.value })}
            />
            <button type="submit" style={{ width: '100%', borderRadius: '12px' }}>Add Prize</button>
          </form>
        )}

        {/* Prize list */}
        {prizes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            No prizes yet. Add some to motivate your AquaHero! 🌟
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {prizes.map(prize => (
              <div
                key={prize.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  background: 'var(--background-color)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>
                  {prize.image_url ? '🖼️' : '🎁'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{prize.title}</div>
                  {prize.description && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{prize.description}</div>
                  )}
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    ⭐ {prize.point_cost} points
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePrize(prize.id)}
                  className="danger"
                  style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem', borderRadius: '8px' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
