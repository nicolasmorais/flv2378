'use client';

import { useState, useMemo } from 'react';
import { useNotesStore } from '@/hooks/use-notes-store';
import type { Note } from '@/lib/types';
import NoteCard from '@/components/note-card';
import NoteForm from '@/components/note-form';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PlusCircle } from 'lucide-react';

export default function FolhagemPage() {
  const { notes, addNote, updateNote, deleteNote, isLoaded } = useNotesStore();
  const [isNoteFormOpen, setNoteFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => note.category === 'Folhagem')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notes]);

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setNoteFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingNote(undefined);
    setNoteFormOpen(true);
  };

  const handleNoteFormClose = () => {
    setNoteFormOpen(false);
    setEditingNote(undefined);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'category' | 'tags' | 'description'> & { plu: string; barcode: string }) => {
    const noteToSave = {
      title: noteData.title,
      content: `PLU: ${noteData.plu}\nBarcode: ${noteData.barcode}`,
      category: 'Folhagem',
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Plus Folhagem</h1>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Cadastro
            </Button>
          </div>

          <ScrollArea className="flex-1 -mx-4">
             <div className="px-4">
              {!isLoaded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
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
              {isLoaded && filteredNotes.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={() => handleEdit(note)}
                      onDelete={() => deleteNote(note.id)}
                    />
                  ))}
                </div>
              )}
              {isLoaded && filteredNotes.length === 0 && (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold text-muted-foreground">
                    Nenhum item cadastrado
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Clique em "Novo Cadastro" para começar.
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
        activeCategory="Folhagem"
      />
    </div>
  );
}
