
'use client';

import { useState, useMemo } from 'react';
import { useNotesStore } from '@/hooks/use-notes-store';
import type { Note } from '@/lib/types';
import NoteForm from '@/components/note-form';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Copy, Check, MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function FolhagemPage() {
  const { notes, addNote, updateNote, deleteNote, isLoaded } = useNotesStore();
  const [isNoteFormOpen, setNoteFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [copiedPlu, setCopiedPlu] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => note.category === 'Folhagem')
      .sort((a, b) => a.title.localeCompare(b.title));
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

  const handleCopy = (plu: string) => {
    navigator.clipboard.writeText(plu);
    setCopiedPlu(plu);
    setTimeout(() => setCopiedPlu(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Plus Folhagem</h1>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Cadastro
            </Button>
          </div>

          <ScrollArea className="flex-1 -mx-4 rounded-lg border">
             <div className="p-4 space-y-2">
              {!isLoaded && [...Array(15)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                  <Skeleton className="h-7 w-7" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-7 w-7" />
                </div>
              ))}
              {isLoaded && filteredNotes.length > 0 && (
                <>
                  {filteredNotes.map((note, index) => {
                     const pluMatch = note.content.match(/PLU: (.*)/);
                     const plu = pluMatch ? pluMatch[1].trim() : '';
                     return (
                      <div key={note.id} className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                        <div className="flex items-center gap-2 truncate">
                           <div className="flex items-center">
                                <span className="w-6 text-sm font-medium text-muted-foreground">{index + 1}.</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => handleCopy(plu)}>
                                    {copiedPlu === plu ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                          <div className="truncate">
                            <span className="font-mono text-2xl font-bold">{plu}</span>
                            <span className="font-medium text-sm uppercase text-muted-foreground"> - {note.title.toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                                      <MoreVertical className="h-4 w-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(note)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      <span>Editar</span>
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                              <span className="text-destructive">Deletar</span>
                                          </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                          <AlertDialogHeader>
                                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                  Essa ação não pode ser desfeita. Isso irá deletar o item permanentemente.
                                              </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                              <AlertDialogAction onClick={() => deleteNote(note.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                  Deletar
                                              </AlertDialogAction>
                                          </AlertDialogFooter>
                                      </AlertDialogContent>
                                  </AlertDialog>
                              </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                     )
                  })}
                </>
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
