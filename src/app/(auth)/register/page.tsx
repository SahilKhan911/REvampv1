'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signUpWithEmail } from '@/lib/firebase/auth';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  college: z.string().min(2, { message: 'College name is required.' }),
  year: z.string({ required_error: 'Please select your year of study.' }),
  collegeEmail: z
    .string()
    .email({ message: 'Please enter a valid college email.' }),
});

const TOTAL_STEPS = 6;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      college: '',
      collegeEmail: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { password, ...userData } = values;
      await signUpWithEmail(password, {
        ...userData,
        year: parseInt(values.year, 10),
      });
      router.push('/dashboard');
      toast({
        title: 'Account Created',
        description: "Welcome! We're glad to have you.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  type FieldName = keyof z.infer<typeof formSchema>;

  const steps = [
    {
      id: 1,
      title: 'What should we call you?',
      fields: ['name'] as FieldName[],
    },
    {
      id: 2,
      title: 'How can we reach you?',
      fields: ['email'] as FieldName[],
    },
    { id: 3, title: 'Secure your account', fields: ['password'] as FieldName[] },
    { id: 4, title: 'Where do you study?', fields: ['college'] as FieldName[] },
    { id: 5, title: 'What year are you in?', fields: ['year'] as FieldName[] },
    {
      id: 6,
      title: 'Verify your student status',
      fields: ['collegeEmail'] as FieldName[],
    },
  ];

  const handleNext = async () => {
    const fields = steps[step - 1].fields;
    const output = await form.trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      await form.handleSubmit(onSubmit)();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">
          {steps[step - 1].title}
        </CardTitle>
        <CardDescription>
          Join the REvamp community. Step {step} of {TOTAL_STEPS}
        </CardDescription>
        <Progress value={(step / TOTAL_STEPS) * 100} className="w-full mt-2" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4 py-4">
            {step === 1 && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {step === 2 && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {step === 3 && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {step === 4 && (
              <FormField
                control={form.control}
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Name</FormLabel>
                    <FormControl>
                      <Input placeholder="University of Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {step === 5 && (
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Study</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {step === 6 && (
              <FormField
                control={form.control}
                name="collegeEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="student.id@university.edu"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <div className="flex w-full justify-between">
          <Button
            type="button"
            onClick={handlePrev}
            variant="outline"
            disabled={step === 1 || isLoading}
          >
            Back
          </Button>
          <Button type="button" onClick={handleNext} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {step === TOTAL_STEPS ? 'Create Account' : 'Next'}
          </Button>
        </div>
        <p className="pt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}