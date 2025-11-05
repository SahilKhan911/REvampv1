
'use client';
import { useState, useEffect }from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import type { AmbassadorApplication, User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, User as UserIcon, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ApplicationWithUser extends AmbassadorApplication {
    id: string;
    applicant: User | null;
}

export default function AmbassadorApplicationsPage() {
    const [pendingApps, setPendingApps] = useState<ApplicationWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchPendingApps = async () => {
            setIsLoading(true);
            try {
                const appsRef = collection(db, 'ambassadorApplications');
                const q = query(appsRef, where('status', '==', 'pending'));
                const querySnapshot = await getDocs(q);
                const apps: ApplicationWithUser[] = [];

                for (const appDoc of querySnapshot.docs) {
                    const appData = { id: appDoc.id, ...appDoc.data() } as AmbassadorApplication & { id: string };
                    
                    const userRef = doc(db, 'users', appData.userId);
                    const userSnap = await getDoc(userRef);
                    const applicant = userSnap.exists() ? userSnap.data() as User : null;

                    apps.push({ ...appData, applicant });
                }

                setPendingApps(apps);
            } catch (err: any) {
                console.error("Error fetching pending applications:", err);
                setError(err.message || 'Failed to fetch applications.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingApps();
    }, []);

    const handleApproval = async (applicationId: string, userId: string, status: 'approved' | 'rejected') => {
        try {
            const appRef = doc(db, 'ambassadorApplications', applicationId);
            await updateDoc(appRef, { status });

            if (status === 'approved') {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, { role: 'ambassador' });
                // In a real app, a Cloud Function would trigger from this update to:
                // 1. Create an 'ambassadors' collection document.
                // 2. Send a welcome email with further instructions.
            }

            setPendingApps(prevApps => prevApps.filter(app => app.id !== applicationId));
            toast({
                title: `Application ${status}`,
                description: `The application has been successfully ${status}.`,
            });
        } catch (err: any) {
            console.error(`Error updating application status:`, err);
            toast({
                title: 'Update Failed',
                description: err.message || `Could not update the application.`,
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return (
            <div>
                <h1 className="text-3xl font-bold font-headline mb-2">Ambassador Applications</h1>
                <p className="text-muted-foreground mb-8">Review and process new applications.</p>
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
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
            <h1 className="text-3xl font-bold font-headline mb-2">Ambassador Applications</h1>
            <p className="text-muted-foreground mb-8">
                Review and process new applications. Found {pendingApps.length} request(s).
            </p>

            {pendingApps.length === 0 ? (
                 <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>All caught up!</AlertTitle>
                    <AlertDescription>There are no pending applications at the moment.</AlertDescription>
                </Alert>
            ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {pendingApps.map(app => (
                        <Card key={app.id} className="flex flex-col">
                            <CardHeader>
                                <div className='flex items-start gap-4'>
                                    <Avatar className='h-12 w-12'>
                                        <AvatarImage src={app.applicant?.photoURL} />
                                        <AvatarFallback>{app.applicant?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle>{app.applicant?.name}</CardTitle>
                                        <CardDescription>{app.applicant?.college} &middot; {app.applicant?.year} Year</CardDescription>
                                        <CardDescription>Applied {formatDistanceToNow(app.appliedAt.toDate(), { addSuffix: true })}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-6">
                                <div>
                                    <h4 className='font-semibold text-sm mb-1'>Why do you want to join?</h4>
                                    <p className='text-sm text-muted-foreground p-3 bg-muted rounded-md'>{app.answers.why}</p>
                                </div>
                                 <div>
                                    <h4 className='font-semibold text-sm mb-1'>What will you do for the community?</h4>
                                    <p className='text-sm text-muted-foreground p-3 bg-muted rounded-md'>{app.answers.what}</p>
                                </div>
                                 <div>
                                    <h4 className='font-semibold text-sm mb-1'>Leadership Experience</h4>
                                    <p className='text-sm text-muted-foreground p-3 bg-muted rounded-md'>{app.answers.experience}</p>
                                </div>
                                <Button variant="outline" asChild>
                                    <a href={app.videoUrl} target="_blank" rel="noopener noreferrer">
                                        <Video className="mr-2 h-4 w-4" /> Watch Video Intro
                                    </a>
                                </Button>
                            </CardContent>
                            <CardFooter className="gap-4">
                                <Button className="w-full" onClick={() => handleApproval(app.id, app.userId, 'approved')}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                </Button>
                                <Button variant="destructive" className="w-full" onClick={() => handleApproval(app.id, app.userId, 'rejected')}>
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
