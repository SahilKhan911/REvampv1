'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { firestoreSecuritySuggestion } from '@/ai/flows/firestore-security-suggestion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, Loader2, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  schemaDescription: z.string().min(50, 'Please provide a more detailed schema description (min 50 chars).'),
  accessControlRequirements: z.string().min(50, 'Please provide more detailed access requirements (min 50 chars).'),
});

export default function AccessControlPage() {
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        schemaDescription: `// users collection
users/{userId}
  - name: string
  - email: string
  - college: string
  - year: number (1-4)
  - collegeEmail: string
  - verificationStatus: 'pending' | 'verified' | 'rejected'
  - createdAt: timestamp
  - isAdmin: boolean (optional)

// events collection
events/{eventId}
  - title: string
  - description: string
  - date: timestamp
  - bannerUrl: string`,
        accessControlRequirements: `1. Users can read their own user document.
2. Only admins can create, update, or delete other user documents.
3. Anyone (even unauthenticated users) can read documents from the events collection.
4. Only admins can create, update, or delete documents in the events collection.`,
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSuggestion('');
    try {
      const result = await firestoreSecuritySuggestion(values);
      setSuggestion(result.securityRules);
      toast({
        title: 'Rules Generated',
        description: 'AI has successfully generated your Firestore rules.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Rules',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Firestore Security Rule Generator</h1>
        <p className="text-muted-foreground">
          Use AI to generate secure and efficient Firestore rules based on your app&apos;s logic.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Define Your Schema</CardTitle>
            <CardDescription>
              Describe your Firestore collections, documents, and fields.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="schemaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schema Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A 'posts' collection with fields: title, content, authorId..."
                          className="min-h-[200px] font-mono text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accessControlRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Control Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Users can only edit their own posts. Admins can delete any post."
                          className="min-h-[200px] font-mono text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Rules
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Generated Rules</CardTitle>
            <CardDescription>
              Copy and paste these rules into your Firebase project.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="relative">
              <ScrollArea className="h-[520px] w-full rounded-md border bg-muted/50">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : suggestion ? (
                  <pre className="p-4 text-xs font-mono"><code className="language-firestore">{suggestion}</code></pre>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Your generated rules will appear here.</p>
                    </div>
                )}
              </ScrollArea>
              {suggestion && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
