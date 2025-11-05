'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { LogoIcon } from '@/components/icons';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <LogoIcon className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              REvamp
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {user && (
              <Link
                href="/dashboard"
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname.startsWith('/dashboard')
                    ? 'text-foreground font-semibold'
                    : 'text-foreground/60'
                )}
              >
                Dashboard
              </Link>
            )}
             {user?.isAdmin && (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'gap-1 px-2 text-foreground/60 hover:text-foreground/80',
                      pathname.startsWith('/admin') && 'text-foreground font-semibold'
                    )}
                  >
                    Admin
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => window.location.href='/admin/verifications'}>
                    Verifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href='/admin/events/create'}>
                    Create Event
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href='/admin/ambassadors'}>
                    Ambassadors
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <UserNav />
          ) : (
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
