'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { School, Users, Calendar, IndianRupee } from "lucide-react";
import Link from "next/link";

// Placeholder data until Firestore fetching is implemented
const dummyWorkshops = [
    {
        id: 'ws-1',
        title: 'Intro to AI with Gemini',
        description: 'A beginner-friendly workshop on leveraging Google\'s Gemini for building AI applications.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        domains: ['ai-ml'],
        isFree: false,
        price: 49900, // in paise
        registrations: 23,
        maxSeats: 50,
        bannerUrl: 'https://picsum.photos/seed/ws1/600/400'
    }
];

export default function StudentWorkshopsPage() {

    // In a real implementation, you'd fetch available workshops from Firestore here.
    // The registration logic would also be connected to a backend function.

    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Workshops</h1>
                    <p className="text-muted-foreground">Discover workshops to level-up your skills.</p>
                </div>
            </div>

            {dummyWorkshops.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Workshops</CardTitle>
                        <CardDescription>No workshops available for you right now.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                        <School className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Check back later for new workshops!</p>
                    </CardContent>
                </Card>
            ) : (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {dummyWorkshops.map(workshop => (
                        <Card key={workshop.id} className="flex flex-col">
                            <CardHeader>
                                <div className="relative aspect-video mb-4">
                                     <img src={workshop.bannerUrl} alt={workshop.title} className="rounded-lg object-cover w-full h-full" />
                                </div>
                                <CardTitle>{workshop.title}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{format(workshop.date, 'PPP')}</span>
                                </div>
                                <CardDescription className="pt-2">{workshop.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                 <div className="flex flex-wrap gap-2">
                                    {workshop.domains.map(d => <Badge key={d} variant="secondary">{d}</Badge>)}
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-semibold text-muted-foreground flex items-center gap-1"><Users className="h-4 w-4" /> Seats Left</span>
                                    <Badge variant="outline">{workshop.maxSeats - workshop.registrations} / {workshop.maxSeats}</Badge>
                                </div>
                                 <div className="flex items-center justify-between text-sm">
                                    <span className="font-semibold text-muted-foreground flex items-center gap-1"><IndianRupee className="h-4 w-4" /> Price</span>
                                    <Badge variant={workshop.isFree ? 'default' : 'destructive'}>
                                        {workshop.isFree ? 'Free' : `₹${workshop.price / 100}`}
                                    </Badge>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">
                                    {workshop.isFree ? 'Register Now' : `Pay ₹${workshop.price/100} to Register`}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

        </div>
    )
}
