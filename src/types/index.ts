import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export type User = {
  uid: string;
  email: string;
  name: string;
  college: string;
  year: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Timestamp;
  collegeIdUrl?: string;
  studentIdNumber?: string;
  primaryDomain: string;
  domains: string[];
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  badges: string[];
  streak: number;
  lastActiveDate?: Timestamp;
};

export interface AuthUser extends FirebaseUser {
  isAdmin?: boolean;
}
