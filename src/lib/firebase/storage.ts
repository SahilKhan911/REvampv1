'use client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export async function uploadCollegeId(userId: string, file: File): Promise<string> {
    const filePath = `college-ids/${userId}/${file.name}`;
    const storageRef = ref(storage, filePath);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
}

export async function uploadEventBanner(eventId: string, file: File): Promise<string> {
    const filePath = `event-banners/${eventId}/${file.name}`;
    const storageRef = ref(storage, filePath);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
}
