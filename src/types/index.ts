export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
}

export interface MeditationSession {
  id?: string;
  userId: string;
  type: 'meditation';
  duration: number;
  startedAt: Date;
  endedAt: Date;
  locationId?: string;
}

export interface MovementSample {
  timestamp: number;
  x: number;
  y: number;
  z: number;
}

export interface SleepLog {
  id?: string;
  userId: string;
  startedAt: Date;
  endedAt: Date;
  movementData: MovementSample[];
  qualityScore: number;
}

export interface MoodEntry {
  id?: string;
  userId: string;
  mood: 1 | 2 | 3 | 4 | 5;
  note: string;
  createdAt: Date;
}

export interface FavoritePlace {
  id?: string;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}
