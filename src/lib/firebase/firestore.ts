import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import type { User } from '@/types';

type UserCreationData = Omit<User, 'uid' | 'createdAt' | 'verificationStatus' | 'tier' | 'streak' | 'lastActiveDate' | 'collegeIdUrl' | 'studentIdNumber'>;

export async function createUserDocument(userId: string, data: UserCreationData) {
  const userRef = doc(db, 'users', userId);
  const newUser: Omit<User, 'uid'> = {
    ...data,
    verificationStatus: 'pending',
    tier: 'Bronze',
    streak: 0,
    points: data.points || 0,
    badges: data.badges || [],
    createdAt: serverTimestamp() as any,
  };
  await setDoc(userRef, newUser, { merge: true });
}

export async function updateUserDocument(userId: string, data: Partial<User>) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        ...data,
    });
}
