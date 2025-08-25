'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Choose how the app looks
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-[150px] justify-start">
            {theme === 'light' ? (
              <Sun className="w-4 h-4 mr-2" />
            ) : theme === 'dark' ? (
              <Moon className="w-4 h-4 mr-2" />
            ) : (
              <Monitor className="w-4 h-4 mr-2" />
            )}
            {theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : 'System'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')}>
            <Sun className="w-4 h-4 mr-2" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            <Moon className="w-4 h-4 mr-2" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            <Monitor className="w-4 h-4 mr-2" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
