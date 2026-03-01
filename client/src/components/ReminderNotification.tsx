import React from 'react';
import Button from './Button';

interface ReminderNotificationProps {
  reminderTime: string;
  onDismiss: () => void;
  onShowerComplete: () => void;
}

const ReminderNotification: React.FC<ReminderNotificationProps> = ({
  reminderTime,
  onDismiss,
  onShowerComplete,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
        <div className="text-8xl mb-4 animate-bounce-slow">🚿</div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Shower Time! 🎉
        </h2>
        
        <p className="text-lg text-gray-600 mb-6">
          It's {reminderTime}! Time for your fun shower adventure!
        </p>
        
        <div className="space-y-4">
          <Button
            variant="success"
            size="large"
            onClick={onShowerComplete}
            className="w-full"
          >
            I'm Ready to Shower! 🧼
          </Button>
          
          <Button
            variant="secondary"
            size="medium"
            onClick={onDismiss}
            className="w-full"
          >
            Remind Me Later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReminderNotification;
