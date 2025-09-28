'use client';

import { ShieldCheck, Search, Plus, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddNew: () => void;
  onGeneratePassword: () => void;
}

export default function AppHeader({
  searchTerm,
  onSearchChange,
  onAddNew,
  onGeneratePassword,
}: AppHeaderProps) {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-primary-foreground bg-primary/80 p-1 rounded-md" />
            <h1 className="text-xl font-bold tracking-tight">CopiNote</h1>
          </div>
          <div className="flex flex-1 items-center justify-center px-4 sm:px-8 lg:px-16">
            <div className="w-full max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notes..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onGeneratePassword} className="hidden sm:inline-flex">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
            <Button onClick={onAddNew} size="sm">
              <Plus className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add New</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
