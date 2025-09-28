'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PlusCircle } from 'lucide-react';
import NoteForm from '@/components/note-form';
import type { Note } from '@/lib/types';
import { useNotesStore } from '@/hooks/use-notes-store';
import NoteCard from '@/components/note-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';


type Category = 'Frutas' | 'Legumes e Verduras' | 'Outros';

export default function Home() {
  const [isNoteFormOpen, setNoteFormOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const { notes, addNote, updateNote, deleteNote, isLoaded } = useNotesStore();

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notes]);

  const handleAddNew = (category: Category) => {
    setActiveCategory(category);
    setEditingNote(undefined);
    setNoteFormOpen(true);
  };
  
  const handleNoteFormClose = () => {
    setNoteFormOpen(false);
    setActiveCategory(null);
    setEditingNote(undefined);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'category' | 'tags' | 'description'> & { plu: string; barcode: string }) => {
    const noteToSave = {
      title: noteData.title,
      content: `PLU: ${noteData.plu}\nBarcode: ${noteData.barcode}`,
      category: activeCategory || 'Outros',
      description: '',
      tags: [],
    };

    if (editingNote) {
        updateNote(editingNote.id, noteToSave);
    } else {
        addNote(noteToSave);
    }
    handleNoteFormClose();
  };
  
  const handleEdit = (note: Note) => {
    setActiveCategory(note.category as Category);
    setEditingNote(note);
    setNoteFormOpen(true);
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
          <h1 className="text-2xl font-bold mb-6">Todos os Plus</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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

          <h2 className="text-xl font-bold mt-8 mb-4">Itens Cadastrados</h2>
          <ScrollArea className="flex-1 -mx-4">
             <div className="px-4 pb-4">
              {!isLoaded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg space-y-3">
                       <Skeleton className="h-5 w-2/3" />
                       <Skeleton className="h-4 w-1/2" />
                       <Skeleton className="h-8 w-full" />
                       <div className="flex gap-2 pt-2">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-16" />
                       </div>
                    </div>
                  ))}
                </div>
              )}
              {isLoaded && sortedNotes.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={() => handleEdit(note)}
                      onDelete={() => deleteNote(note.id)}
                    />
                  ))}
                </div>
              )}
              {isLoaded && sortedNotes.length === 0 && (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold text-muted-foreground">
                    Nenhum item cadastrado
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Use os botões acima para começar a cadastrar.
                  </p>
                </div>
              )}
             </div>
          </ScrollArea>
        </div>
      </main>

      <NoteForm
        isOpen={isNoteFormOpen}
        onOpenChange={handleNoteFormClose}
        note={editingNote}
        onSave={handleSaveNote}
        activeCategory={activeCategory}
      />
    </div>
  );
}
