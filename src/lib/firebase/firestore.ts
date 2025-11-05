import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import type { User } from '@/types';

type UserCreationData = Omit<User, 'uid' | 'createdAt' | 'verificationStatus'>;

export async function createUserDocument(userId: string, data: UserCreationData) {
  const userRef = doc(db, 'users', userId);
  const newUser: Omit<User, 'uid'> = {
    ...data,
    verificationStatus: 'pending',
    createdAt: serverTimestamp() as any, // Will be converted to Timestamp by the server
  };
  await setDoc(userRef, newUser);
}
