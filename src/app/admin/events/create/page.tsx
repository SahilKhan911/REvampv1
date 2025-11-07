
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LinkIcon } from "lucide-react";

export default function CreateEventPage() {
  return (
    <div className="container py-8">
       <h1 className="text-3xl font-bold font-headline mb-2">Create New Event</h1>
       <p className="text-muted-foreground mb-8">Event creation is now managed directly via Luma.</p>
        
        <Card className="max-w-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Simplified Event Workflow
                </CardTitle>
                <CardDescription>
                    To simplify event management, we now embed the community Luma calendar directly in the student dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <p>
                    There is no longer a need to create events here. Simply create your event on <a href="https://lu.ma" target="_blank" rel="noopener noreferrer" className="text-primary underline">Luma.so</a> and it will automatically appear in the "Discover" tab for all students.
                </p>
                <p>
                    This ensures students always have the most up-to-date information and reduces administrative overhead.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}

    