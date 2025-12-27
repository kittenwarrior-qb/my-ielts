import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  User,
  LogOut,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface SidebarProps {
  user: User;
  onNavigate?: () => void;
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: any;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const navigationSections: NavigationSection[] = [
  {
    title: 'Dashboard',
    items: [
      { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Statistics', href: '/dashboard/stats', icon: BarChart3 },
    ],
  },
  {
    title: 'Vocabulary',
    items: [
      { label: 'All vocabulary', href: '/dashboard/vocabulary' },
      { label: 'By topics', href: '/dashboard/vocabulary/topics' },
      { label: 'By band score', href: '/dashboard/vocabulary/bands' },
    ],
  },
  {
    title: 'Grammar',
    items: [
      { label: 'All grammar', href: '/dashboard/grammar' },
      { label: 'By topics', href: '/dashboard/grammar/topics' },
      { label: 'By level', href: '/dashboard/grammar/levels' },
    ],
  },
  {
    title: 'Expression',
    items: [
      { label: 'All expressions', href: '/dashboard/expressions' },
      { label: 'Idioms', href: '/dashboard/expressions?type=idiom' },
      { label: 'Phrases', href: '/dashboard/expressions?type=phrase' },
    ],
  },
];

export default function Sidebar({ user, onNavigate }: SidebarProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const handleNavigate = (href: string) => {
    window.location.href = href;
    onNavigate?.();
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-extrabold">
          my <span className="text-ielts-500">IELTS</span>
        </h1>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start',
                        isActive && 'bg-ielts-50 text-ielts-600 hover:bg-ielts-100 dark:bg-ielts-900/20 dark:text-ielts-400'
                      )}
                      onClick={() => handleNavigate(item.href)}
                    >
                      {Icon && <Icon className="mr-3 h-4 w-4" />}
                      <span className="flex-1 text-left">{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-ielts-500 to-ielts-600 text-white">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigate('/dashboard/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('/dashboard/profile')}>
              <User className="mr-2 h-4 w-4" />
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
