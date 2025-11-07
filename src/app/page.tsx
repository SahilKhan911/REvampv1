import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Award, BarChart, Briefcase, Code, Rocket, Users } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container relative">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20 text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] font-headline">
          India&apos;s Most Exclusive Community for Ambitious College Students
        </h1>
        <p
          className="max-w-[750px] text-lg text-muted-foreground sm:text-xl"
          data-brr="true"
        >
          A close-knit community of student builders, creators, and innovators, driven by a passion for learning and a desire to create an impact.
        </p>
        <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
          <Button asChild className="font-bold" size="lg">
            <Link href="/onboarding">Join The Community</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl items-start gap-10 py-12 md:grid-cols-3">
        <div className="grid gap-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold font-headline">Learn & Grow Together</h3>
          <p className="text-muted-foreground">
            Participate in exclusive events, hands-on workshops, and mentorship sessions led by industry experts.
          </p>
        </div>

        <div className="grid gap-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <Code className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold font-headline">Build & Ship Together</h3>
          <p className="text-muted-foreground">
            Collaborate on real-world projects, participate in hackathons, and showcase your work to a national audience.
          </p>
        </div>

        <div className="grid gap-4 text-center">
         <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold font-headline">Exclusive Perks</h3>
          <p className="text-muted-foreground">
            Unlock rewards, get access to internship opportunities, and earn swag as you climb the leaderboard.
          </p>
        </div>
      </section>

       <section className="py-12 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold font-headline md:text-4xl">What is REvamp?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
                REvamp is a dynamic, gamified platform designed to empower the next generation of tech talent. We bridge the gap between academic learning and real-world application, offering you a universe of opportunities to grow your skills, build your network, and launch your career.
            </p>
        </div>
      </section>
    </div>
  );
}
