
'use client';

import { useState, useMemo } from 'react';
import { useNotesStore } from '@/hooks/use-notes-store';
import type { Note } from '@/lib/types';
import AccessForm from '@/components/access-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, MoreVertical, Edit, Trash2, Copy, Check } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CopyableField = ({ label, value }: { label: string, value: string }) => {
    const [copied, setCopied] = useState(false);
    
    if (!value) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2 text-sm">
            <p className="font-medium truncate">
                <span className="text-muted-foreground">{label}: </span>
                <span className="font-mono">{value}</span>
            </p>
            <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
        </div>
    );
};

export default function AcessosPage() {
  const { notes, addNote, updateNote, deleteNote, isLoaded } = useNotesStore();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const accesses = useMemo(() => {
    return notes
      .filter(note => note.category === 'Acessos')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notes]);

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

  const handleSaveNote = (data: { systemName: string; link: string; username: string; password: string; }) => {
    const noteToSave = {
      title: data.systemName,
      content: `Link: ${data.link}\nUsuário: ${data.username}\nSenha: ${data.password}`,
      category: 'Acessos',
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
  
  const parseContent = (content: string) => {
    const linkMatch = content.match(/Link: (.*)/);
    const userMatch = content.match(/Usuário: (.*)/);
    const passMatch = content.match(/Senha: (.*)/);
    return {
      link: linkMatch ? linkMatch[1].trim() : '',
      username: userMatch ? userMatch[1].trim() : '',
      password: passMatch ? passMatch[1].trim() : '',
    }
  }


  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Acessos</h1>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Acesso
            </Button>
          </div>

          <div className="flex-1">
            {!isLoaded && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {isLoaded && accesses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accesses.map(note => {
                  const { link, username, password } = parseContent(note.content);
                  return (
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
                                                  Essa ação não pode ser desfeita. Isso irá deletar o acesso permanentemente.
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
                      <CardContent className="flex-1 space-y-2">
                          <CopyableField label="Link" value={link} />
                          <CopyableField label="Usuário" value={username} />
                          <CopyableField label="Senha" value={password} />
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
            {isLoaded && accesses.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-muted-foreground">
                  Nenhum acesso encontrado
                </h3>
                <p className="text-muted-foreground mt-2">
                  Clique em "Novo Acesso" para começar.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <AccessForm
        isOpen={isFormOpen}
        onOpenChange={handleFormClose}
        note={editingNote}
        onSave={handleSaveNote}
      />
    </div>
  );
}
