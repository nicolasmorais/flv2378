'use client';

import { ShieldCheck, Search, Plus, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface AppHeaderProps {
  onGeneratePassword: () => void;
}

export default function AppHeader({
  onGeneratePassword,
}: AppHeaderProps) {
  return (
    <header className="border-b bg-card backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
          </div>
          <div className="flex flex-1 items-center justify-center px-4 sm:px-8 lg:px-16">
           
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onGeneratePassword} className="hidden sm:inline-flex">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
            
          </div>
        </div>
      </div>
    </header>
  );
}
