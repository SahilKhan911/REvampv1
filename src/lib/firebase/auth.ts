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

// Sign up with email and password
export async function signUpWithEmail(
  password: string,
  userData: {
    name: string;
    email: string;
    college: string;
    year: number;
    collegeEmail: string;
  }
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    userData.email,
    password
  );
  const { uid } = userCredential.user;
  await createUserDocument(uid, userData);
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
