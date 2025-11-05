'use client';
import { useState, useEffect }from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import type { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

interface UserWithId extends User {
    id: string;
}

export default function VerificationsPage() {
    const [pendingUsers, setPendingUsers] = useState<UserWithId[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchPendingUsers = async () => {
            setIsLoading(true);
            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('verificationStatus', '==', 'pending'));
                const querySnapshot = await getDocs(q);
                const users: UserWithId[] = [];
                querySnapshot.forEach((doc) => {
                    users.push({ id: doc.id, ...(doc.data() as User) });
                });
                setPendingUsers(users);
            } catch (err: any) {
                console.error("Error fetching pending users:", err);
                setError(err.message || 'Failed to fetch verification requests.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingUsers();
    }, []);

    const handleVerification = async (docId: string, status: 'verified' | 'rejected') => {
        try {
            const userRef = doc(db, 'users', docId);
            await updateDoc(userRef, { verificationStatus: status });

            setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== docId));
            toast({
                title: `User ${status}`,
                description: `The user has been successfully ${status}.`,
            });
            // Here you would trigger an email notification via a cloud function
        } catch (err: any) {
            console.error(`Error updating user status:`, err);
            toast({
                title: 'Update Failed',
                description: err.message || `Could not ${status} the user.`,
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return (
            <div>
                <h1 className="text-3xl font-bold font-headline mb-2">Pending Verifications</h1>
                <p className="text-muted-foreground mb-8">Review and process new user registrations.</p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                            <CardContent className='space-y-4'>
                                <Skeleton className="h-40 w-full" />
                                <Skeleton className="h-4 w-full" />
                                 <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                            <CardFooter className='gap-4'>
                                <Skeleton className="h-10 w-1/2" />
                                <Skeleton className="h-10 w-1/2" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
         return (
            <div>
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Pending Verifications</h1>
            <p className="text-muted-foreground mb-8">
                Review and process new user registrations. Found {pendingUsers.length} request(s).
            </p>

            {pendingUsers.length === 0 ? (
                 <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>All caught up!</AlertTitle>
                    <AlertDescription>There are no pending verification requests at the moment.</AlertDescription>
                </Alert>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pendingUsers.map(user => (
                        <Card key={user.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><UserIcon className='h-5 w-5' />{user.name}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                {user.collegeIdUrl ? (
                                     <a href={user.collegeIdUrl} target="_blank" rel="noopener noreferrer" title='Click to open in new tab'>
                                        <div className="relative aspect-video w-full rounded-md overflow-hidden border hover:opacity-80 transition-opacity">
                                            <Image src={user.collegeIdUrl} alt={`College ID for ${user.name}`} fill style={{ objectFit: 'contain' }} />
                                        </div>
                                    </a>
                                ) : (
                                    <div className='flex items-center justify-center h-40 w-full rounded-md bg-muted text-muted-foreground text-sm'>
                                        ID Image not available
                                    </div>
                                )}
                                <p><span className='font-semibold'>College:</span> {user.college}</p>
                                <p><span className='font-semibold'>Year:</span> {user.year}</p>
                            </CardContent>
                            <CardFooter className="gap-4">
                                <Button className="w-full" onClick={() => handleVerification(user.id, 'verified')}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                </Button>
                                <Button variant="destructive" className="w-full" onClick={() => handleVerification(user.id, 'rejected')}>
                                    <XCircle className="mr-2 h-4 w-4" /> Reject
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
