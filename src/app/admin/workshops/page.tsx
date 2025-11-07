'use client';

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function AdminWorkshopsPage() {

    // In a real implementation, you'd fetch workshops from Firestore here.

    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Manage Workshops</h1>
                    <p className="text-muted-foreground">Create, edit, and view workshop details and attendees.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/workshops/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Workshop
                    </Link>
                </Button>
            </div>

            {/* This is where you would map over and display fetched workshops */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Workshops</CardTitle>
                    <CardDescription>No workshops have been created yet.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Get started by creating a new workshop.</p>
                    <Button asChild className="mt-4">
                       <Link href="/admin/workshops/create">Create Workshop</Link>
                    </Button>
                </CardContent>
            </Card>

        </div>
    )
}

    