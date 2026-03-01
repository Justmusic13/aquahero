import React, { useState, useEffect, useRef } from 'react';
import { ShowerLog } from '@/types';
import * as showerService from '@/services/shower.service';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import './ShowerPage.css';

const ShowerPage: React.FC = () => {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [logs, setLogs] = useState<ShowerLog[]>([]);
  const countRef = useRef<number | null>(null);
  const { reloadProfile } = useAuth();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const showerLogs = await showerService.getShowerLogs();
      setLogs(showerLogs);
    } catch (error) {
      console.error("Failed to fetch shower logs", error);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setStartTime(new Date());
    countRef.current = window.setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  const handleStop = async () => {
    if (countRef.current) clearInterval(countRef.current);
    setIsActive(false);
    
    if (startTime) {
      try {
        await showerService.completeShower({
          startTime: startTime.toISOString(),
          durationSeconds: timer,
        });
        alert(`Shower complete! Duration: ${timer} seconds. Points awarded!`);
        await reloadProfile();
        await fetchLogs();
      } catch (error) {
        console.error("Failed to complete shower", error);
        alert("There was an error saving your shower. Please try again.");
      }
    }
    
    setTimer(0);
    setStartTime(null);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="shower-container">
      <div className="card timer-card">
        <h2>Shower Timer</h2>
        <div className="timer-display">{formatTime(timer)}</div>
        <div className="timer-controls">
          {!isActive ? (
            <button onClick={handleStart} className="secondary">Start Shower</button>
          ) : (
            <button onClick={handleStop} className="danger">End Shower</button>
          )}
        </div>
      </div>
      <div className="card logs-card">
        <h2>Shower History</h2>
        <ul className="logs-list">
          {logs.length > 0 ? logs.map(log => (
            <li key={log.id}>
              <span>{formatDistanceToNow(new Date(log.end_time), { addSuffix: true })}</span>
              <span>Duration: {log.duration_seconds}s</span>
              <span>Points: +{log.points_earned}</span>
            </li>
          )) : <p>No shower history yet.</p>}
        </ul>
      </div>
    </div>
  );
};

export default ShowerPage;
