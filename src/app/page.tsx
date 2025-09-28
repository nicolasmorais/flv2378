'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PlusCircle } from 'lucide-react';
import NoteForm from '@/components/note-form';
import type { Note } from '@/lib/types';
import { useNotesStore } from '@/hooks/use-notes-store';

type Category = 'Frutas' | 'Legumes e Verduras' | 'Outros';

export default function Home() {
  const [isNoteFormOpen, setNoteFormOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const { addNote } = useNotesStore();

  const handleAddNew = (category: Category) => {
    setActiveCategory(category);
    setNoteFormOpen(true);
  };
  
  const handleNoteFormClose = () => {
    setNoteFormOpen(false);
    setActiveCategory(null);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'category' | 'tags' | 'description'> & { plu: string; barcode: string }) => {
    addNote({
      title: noteData.title,
      content: `PLU: ${noteData.plu}\nBarcode: ${noteData.barcode}`,
      category: activeCategory || 'Outros',
      description: '',
      tags: [],
    });
    handleNoteFormClose();
  };

  return (
    <div className="flex flex-col h-screen">
       <header className="border-b bg-card backdrop-blur-sm sticky top-0 z-10 md:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
            </div>
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold mb-6">Todos os Plus</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Frutas</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => handleAddNew('Frutas')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Cadastrar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legumes e Verduras</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => handleAddNew('Legumes e Verduras')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Cadastrar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outros</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => handleAddNew('Outros')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Cadastrar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <NoteForm
        isOpen={isNoteFormOpen}
        onOpenChange={handleNoteFormClose}
        onSave={handleSaveNote}
        activeCategory={activeCategory}
      />
    </div>
  );
}
