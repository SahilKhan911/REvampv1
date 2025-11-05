import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="container relative">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] font-headline">
          Secure Authentication for the Modern Web
        </h1>
        <span
          className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl"
          data-brr="true"
        >
          Welcome to REvamp Authenticator, the foundation for a secure and seamless user experience powered by Next.js and Firebase.
        </span>
        <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
          <Button asChild className="font-bold">
            <Link href="/onboarding">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl items-start gap-10 py-12 md:grid-cols-3">
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-headline">Email & Google Auth</h3>
          </div>
          <p className="text-muted-foreground">
            Flexible sign-in options using traditional email and password or seamlessly with Google OAuth for quick access.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-headline">Protected Routes</h3>
          </div>
          <p className="text-muted-foreground">
            Robust middleware ensures that sensitive routes and user dashboards are only accessible to authenticated users.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-headline">Admin Roles</h3>
          </div>
          <p className="text-muted-foreground">
            Built-in support for admin roles using Firebase Custom Claims, enabling powerful access control for administrative features.
          </p>
        </div>
      </section>
    </div>
  );
}
