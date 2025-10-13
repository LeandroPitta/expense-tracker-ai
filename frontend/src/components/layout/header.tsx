'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileSidebar } from './sidebar';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';

interface HeaderProps {
  className?: string;
}

// Map routes to breadcrumb titles
const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/expenses': 'Expenses',
  '/expenses/new': 'Add Expense',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  // Handle dynamic routes like /expenses/[id]/edit
  if (pathname.includes('/expenses/') && pathname.includes('/edit')) {
    return 'Edit Expense';
  }
  
  return routeTitles[pathname] || 'Page';
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Mobile menu + Title */}
        <div className="flex items-center gap-4">
          <MobileSidebar />
          <div>
            <h1 className="text-lg font-semibold md:text-xl">{pageTitle}</h1>
          </div>
        </div>

        {/* Center - Search (hidden on mobile) */}
        <div className="hidden flex-1 max-w-md mx-4 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search expenses..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Search button for mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}