'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  CreditCard, 
  FileText, 
  Home, 
  Menu, 
  Settings, 
  X 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: 'Dashboard',
    href: ROUTES.HOME,
    icon: Home,
  },
  {
    name: 'Expenses',
    href: ROUTES.EXPENSES,
    icon: CreditCard,
  },
  {
    name: 'Reports',
    href: ROUTES.REPORTS,
    icon: FileText,
  },
  {
    name: 'Settings',
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
];

function NavItem({ item, isActive }: { item: typeof navigation[0]; isActive: boolean }) {
  const Icon = item.icon;
  
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        isActive 
          ? 'bg-accent text-accent-foreground' 
          : 'text-muted-foreground'
      )}
    >
      <Icon className="h-5 w-5" />
      {item.name}
    </Link>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex h-full flex-col bg-background', className)}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Expense Tracker</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          © 2025 Expense Tracker
        </p>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}