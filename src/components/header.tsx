'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { LogoIcon } from '@/components/icons';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', loggedIn: true },
    { href: '/admin/access-control', label: 'Admin Tool', admin: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <LogoIcon className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              REvamp Authenticator
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => {
              const showLink = (link.loggedIn && user) || (link.admin && user?.isAdmin);
              if (!showLink) return null;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'transition-colors hover:text-foreground/80',
                    pathname === link.href
                      ? 'text-foreground'
                      : 'text-foreground/60'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
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
