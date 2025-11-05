import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export type User = {
  uid: string;
  email: string;
  name: string;
  college: string;
  year: number;
  collegeEmail: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Timestamp;
};

export interface AuthUser extends FirebaseUser {
  isAdmin?: boolean;
}
