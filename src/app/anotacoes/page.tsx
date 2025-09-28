'use client';

import { useState, useEffect } from 'react';
import { useNotesStore } from '@/hooks/use-notes-store';
import type { Note } from '@/lib/types';
import AnnotationForm from '@/components/annotation-form';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PlusCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AnotacoesPage() {
  const { notes, addNote, updateNote, deleteNote, isLoaded, getAnnotations } = useNotesStore();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [annotations, setAnnotations] = useState<Note[]>([]);

  useEffect(() => {
    if(isLoaded) {
        setAnnotations(getAnnotations());
    }
  }, [notes, isLoaded, getAnnotations]);

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingNote(undefined);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingNote(undefined);
  };

  const handleSaveNote = (noteData: { title: string; content: string }) => {
    const noteToSave = {
      title: noteData.title,
      content: noteData.content,
      category: 'Anotação',
      description: '',
      tags: [],
    };

    if (editingNote) {
      updateNote(editingNote.id, noteToSave);
    } else {
      addNote(noteToSave);
    }
    handleFormClose();
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
            <h1 className="text-2xl font-bold">Anotações</h1>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Anotação
            </Button>
          </div>

          <div className="flex-1">
            {!isLoaded && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {isLoaded && annotations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {annotations.map(note => (
                  <Card key={note.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg">{note.title}</CardTitle>
                             <p className="text-xs text-muted-foreground pt-1">
                                {new Date(note.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 -mt-1 -mr-2">
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
                                                Essa ação não pode ser desfeita. Isso irá deletar a anotação permanentemente.
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
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {isLoaded && annotations.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-muted-foreground">
                  Nenhuma anotação encontrada
                </h3>
                <p className="text-muted-foreground mt-2">
                  Clique em "Nova Anotação" para começar.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <AnnotationForm
        isOpen={isFormOpen}
        onOpenChange={handleFormClose}
        note={editingNote}
        onSave={handleSaveNote}
      />
    </div>
  );
}
