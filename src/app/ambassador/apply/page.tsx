
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldCheck, UploadCloud, Rocket } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { uploadAmbassadorVideo } from '@/lib/firebase/storage';

const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const formSchema = z.object({
  why: z.string().min(100, 'Please provide a detailed answer (at least 100 characters).'),
  what: z.string().min(100, 'Please provide a detailed answer (at least 100 characters).'),
  experience: z.string().min(50, 'Please describe your experience (at least 50 characters).'),
  video: z
    .instanceof(File)
    .refine(file => file.size <= MAX_VIDEO_SIZE, 'Video size must be 20MB or less.')
    .refine(file => ACCEPTED_VIDEO_TYPES.includes(file.type), 'Only .mp4, .webm, and .mov files are accepted.'),
});

// Placeholder data - in a real app, this would come from the user's Firestore document
const userProfile = {
  points: 600,
  eventsAttended: 7,
  year: 2,
};

export default function ApplyPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const isEligible = userProfile.points >= 500 && userProfile.eventsAttended >= 5 && userProfile.year >= 2;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      why: '',
      what: '',
      experience: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ title: 'Not authenticated', description: 'You must be logged in to apply.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    try {
      const videoUrl = await uploadAmbassadorVideo(user.uid, values.video);

      await addDoc(collection(db, 'ambassadorApplications'), {
        userId: user.uid,
        answers: {
          why: values.why,
          what: values.what,
          experience: values.experience,
        },
        videoUrl,
        status: 'pending',
        appliedAt: serverTimestamp(),
      });
      
      toast({
        title: 'Application Submitted!',
        description: "We've received your application and will review it shortly.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  if (loading) {
      return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (!isEligible) {
    return (
      <div className='container py-12'>
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Not Yet Eligible</CardTitle>
                <CardDescription>You haven't met the requirements to apply for the ambassador program yet.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                 <p className='text-sm text-muted-foreground'>Here are the requirements:</p>
                 <ul className='list-disc list-inside space-y-2 text-sm'>
                    <li className={userProfile.points >= 500 ? 'text-green-600' : 'text-destructive'}>
                        500+ Points (You have {userProfile.points})
                    </li>
                    <li className={userProfile.eventsAttended >= 5 ? 'text-green-600' : 'text-destructive'}>
                        5+ Events Attended (You have {userProfile.eventsAttended})
                    </li>
                    <li className={userProfile.year >= 2 ? 'text-green-600' : 'text-destructive'}>
                        2nd Year or Above (You are in {userProfile.year} year)
                    </li>
                 </ul>
                 <p className='text-sm text-muted-foreground pt-4'>Keep participating in the community to unlock this opportunity!</p>
            </CardContent>
            <CardFooter>
                 <Button onClick={() => router.push('/dashboard')} className='w-full'>Back to Dashboard</Button>
            </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className='container py-12'>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
            <Rocket className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl font-headline">Become a Campus Ambassador</CardTitle>
          <CardDescription className="text-center">
            You're eligible! Fill out the application below to join our team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="why"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why do you want to join the REvamp ambassador program?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Share your motivation, what you hope to learn, and how you align with our mission..." {...field} rows={5}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="what"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What will you do for the community as an ambassador?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the activities, events, or initiatives you plan to lead on your campus..." {...field} rows={5}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What prior leadership experience do you have?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any roles in clubs, projects, or other organizations..." {...field} rows={3}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="video" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Upload a 1-minute video introduction</FormLabel>
                      <FormControl>
                          <div className="flex items-center justify-center w-full">
                              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                      {field.value ? (
                                          <p className="font-semibold text-primary">{field.value.name}</p>
                                      ) : (
                                          <>
                                              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                              <p className="text-xs text-muted-foreground">MP4, WebM, MOV (MAX. 20MB)</p>
                                          </>
                                      )}
                                  </div>
                                  <Input id="dropzone-file" type="file" accept="video/*" className="hidden" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                              </label>
                          </div>
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              
              <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
