import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';

import { db } from '@/src/config/firebase';
import { FavoritePlace, MeditationSession, MoodEntry } from '@/src/types';

// ── Meditation Sessions ──────────────────────────────────────────────────────

export async function saveMeditationSession(session: Omit<MeditationSession, 'id'>) {
  const ref = collection(db, 'meditationSessions');
  const doc = await addDoc(ref, {
    ...session,
    startedAt: Timestamp.fromDate(session.startedAt),
    endedAt: Timestamp.fromDate(session.endedAt),
  });
  return doc.id;
}

export async function getMeditationSessions(userId: string): Promise<MeditationSession[]> {
  const ref = collection(db, 'meditationSessions');
  const q = query(ref, where('userId', '==', userId), orderBy('startedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      startedAt: (data.startedAt as Timestamp).toDate(),
      endedAt: (data.endedAt as Timestamp).toDate(),
    } as MeditationSession;
  });
}

// ── Mood Entries ─────────────────────────────────────────────────────────────

export async function saveMoodEntry(entry: Omit<MoodEntry, 'id'>) {
  const ref = collection(db, 'moodEntries');
  const doc = await addDoc(ref, {
    ...entry,
    createdAt: Timestamp.fromDate(entry.createdAt),
  });
  return doc.id;
}

export async function getMoodEntries(userId: string): Promise<MoodEntry[]> {
  const ref = collection(db, 'moodEntries');
  const q = query(ref, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: (data.createdAt as Timestamp).toDate(),
    } as MoodEntry;
  });
}

// ── Favorite Places ───────────────────────────────────────────────────────────

export async function saveFavoritePlace(place: Omit<FavoritePlace, 'id'>) {
  const ref = collection(db, 'favoritePlaces');
  const doc = await addDoc(ref, {
    ...place,
    createdAt: Timestamp.fromDate(place.createdAt),
  });
  return doc.id;
}

export async function getFavoritePlaces(userId: string): Promise<FavoritePlace[]> {
  const ref = collection(db, 'favoritePlaces');
  const q = query(ref, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: (data.createdAt as Timestamp).toDate(),
    } as FavoritePlace;
  });
}
