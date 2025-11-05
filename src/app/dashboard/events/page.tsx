'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import type { Event } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Calendar, Tag, Ticket, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth(); // Assuming useAuth provides the full user object from firestore eventually

    // This is a placeholder. In a real app, you'd fetch this from the user's profile in firestore.
    const userProfile = {
        college: 'vit-vellore',
        year: 1,
        primaryDomain: 'web-dev'
    };

    useEffect(() => {
        const fetchEvents = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const eventsRef = collection(db, 'events');
                
                // Simple query for now. Firestore does not support OR queries on different fields.
                // A more complex filtering would require multiple queries and client-side merging,
                // or a more advanced backend/search solution like Algolia.
                const q = query(
                    eventsRef,
                    where('targetYears', 'array-contains', userProfile.year),
                    orderBy('date', 'asc')
                );

                const querySnapshot = await getDocs(q);
                const fetchedEvents: Event[] = [];
                querySnapshot.forEach((doc) => {
                    const eventData = { id: doc.id, ...doc.data() } as Event;
                    // Additional client-side filtering
                    if (eventData.colleges.includes(userProfile.college) || eventData.domains.includes(userProfile.primaryDomain)) {
                       if (eventData.date.toDate() > new Date()) { // Only show future events
                         fetchedEvents.push(eventData);
                       }
                    }
                });
                setEvents(fetchedEvents);
            } catch (err: any) {
                console.error("Error fetching events:", err);
                setError(err.message || 'Failed to fetch events.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [user]);

    const EventCard = ({ event }: { event: Event }) => (
        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="p-0">
                <div className="relative aspect-video w-full">
                    <Image src={event.bannerUrl} alt={event.title} fill className="object-cover" />
                </div>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(event.date.toDate(), 'PPP, p')}</span>
                </div>
                <CardTitle className="font-headline text-xl mb-2">{event.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                    {event.domains.map(domain => <Badge key={domain} variant="secondary">{domain}</Badge>)}
                </div>
            </CardContent>
            <CardFooter className="p-6 bg-muted/50 flex justify-between items-center">
                 <div>
                    <span className="font-bold text-lg">{event.isFree ? 'Free' : `₹${event.price / 100}`}</span>
                </div>
                <Button asChild>
                    <Link href={event.lumaUrl || '#'} target="_blank">
                        Register <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
     const EventCardSkeleton = () => (
        <Card className="flex flex-col overflow-hidden">
            <Skeleton className="w-full aspect-video" />
            <CardContent className="p-6 space-y-4">
                 <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-6 w-full" />
                 <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                 </div>
            </CardContent>
            <CardFooter className="p-6 bg-muted/50 flex justify-between items-center">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-10 w-1/3" />
            </CardFooter>
        </Card>
    );

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Discover Events</h1>
            <p className="text-muted-foreground mb-8">
                Find events tailored to your interests and college.
            </p>

            {isLoading ? (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => <EventCardSkeleton key={i} />)}
                </div>
            ) : error ? (
                 <Alert variant="destructive">
                    <Ticket className="h-4 w-4" />
                    <AlertTitle>Error Fetching Events</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : events.length === 0 ? (
                 <Alert>
                    <Calendar className="h-4 w-4" />
                    <AlertTitle>No Events Found</AlertTitle>
                    <AlertDescription>There are no upcoming events matching your profile right now. Check back later!</AlertDescription>
                </Alert>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}
