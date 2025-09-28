'use client';

import { useState, useMemo } from 'react';
import { useNotesStore } from '@/hooks/use-notes-store';
import type { Note } from '@/lib/types';
import AppHeader from '@/components/header';
import NoteCard from '@/components/note-card';
import NoteForm from '@/components/note-form';
import PasswordGenerator from '@/components/password-generator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { notes, addNote, updateNote, deleteNote, isLoaded } = useNotesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [isNoteFormOpen, setNoteFormOpen] = useState(false);
  const [isPasswordGeneratorOpen, setPasswordGeneratorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const categories = useMemo(() => {
    const allCategories = notes.map(note => note.category).filter(Boolean);
    return ['All', ...Array.from(new Set(allCategories))];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        const categoryMatch = activeCategory === 'All' || !activeCategory ? true : note.category === activeCategory;

        const searchMatch = searchTerm
          ? note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          : true;

        return categoryMatch && searchMatch;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notes, searchTerm, activeCategory]);

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

  return (
    <div className="flex flex-col h-screen">
      <AppHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
        onGeneratePassword={() => setPasswordGeneratorOpen(true)}
      />

      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
          <div className="flex-shrink-0">
             <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-2 pb-4">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={activeCategory === category || (!activeCategory && category === 'All') ? 'secondary' : 'ghost'}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setActiveCategory(category === 'All' ? null : category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </ScrollArea>
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
                    {notes.length > 0 ? 'No notes match your search' : 'No notes yet'}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    {notes.length > 0 ? 'Try a different search or filter.' : 'Click "Add New" to get started.'}
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
        onSave={noteData => {
          if (editingNote) {
            updateNote(editingNote.id, noteData);
          } else {
            addNote(noteData);
          }
          handleNoteFormClose();
        }}
      />
      
      <PasswordGenerator
        isOpen={isPasswordGeneratorOpen}
        onOpenChange={setPasswordGeneratorOpen}
      />
    </div>
  );
}
