'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type UserCredential,
} from 'firebase/auth';
import { auth } from './config';
import { createUserDocument } from './firestore';
import type { User } from '@/types';


type SignUpData = Pick<User, 'name' | 'email' | 'college' | 'year' | 'domains' | 'primaryDomain'>;

// Sign up with email and password
export async function signUpWithEmail(
  password: string,
  userData: SignUpData
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    userData.email,
    password
  );
  const { uid } = userCredential.user;
  // Award points and badges on signup
  await createUserDocument(uid, {
    ...userData,
    points: 50, // 50 points on signup
    badges: ['first-steps'], // Award "First Steps" badge
  });
  return userCredential;
}

// Sign in with email and password
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

// Sign in with Google
export async function signInWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

// Sign out
export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}
