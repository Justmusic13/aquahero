// Augment Express's Request type to include our custom properties
declare global {
  namespace Express {
    export interface Request {
      profile?: {
        id: string;
        userId: string;
      };
    }
  }
}

export interface Profile {
  id: string;
  userId: string;
  childName: string;
  avatarId: number;
  totalPoints: number;
}

export interface Reminder {
  reminderTime: string;
  isActive: boolean;
}
