'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PlusCircle, Copy, Check, MoreVertical, Edit, Trash2, RefreshCw } from 'lucide-react';
import NoteForm from '@/components/note-form';
import type { Note } from '@/lib/types';
import { useNotesStore } from '@/hooks/use-notes-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
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
} from "@/components/ui/alert-dialog"
import { resetDatabaseAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

type Category = 'Frutas' | 'Legumes e Verduras' | 'Outros';

const CategoryCard = ({ 
  category, 
  notes, 
  isLoading, 
  onAddNew,
  onEdit,
  onDelete,
}: { 
  category: Category;
  notes: Note[];
  isLoading: boolean;
  onAddNew: (category: Category) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}) => {
  const [copiedPlu, setCopiedPlu] = useState<string | null>(null);

  const handleCopy = (plu: string) => {
    navigator.clipboard.writeText(plu);
    setCopiedPlu(plu);
    setTimeout(() => setCopiedPlu(null), 2000);
  };
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{category}</CardTitle>
        <Button size="sm" onClick={() => onAddNew(category)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-2 pr-4">
            {isLoading && [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-7 w-7" />
              </div>
            ))}
            {!isLoading && notes.map(note => {
               const pluMatch = note.content.match(/PLU: (.*)/);
               const plu = pluMatch ? pluMatch[1].trim() : '';
               return (
                <div key={note.id} className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                  <p className="font-medium text-sm mr-2 truncate">
                    {note.title} - <span className="font-mono">{plu}</span>
                  </p>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => handleCopy(plu)}>
                      {copiedPlu === plu ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(note)}>
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
                                        <AlertDialogAction onClick={() => onDelete(note.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
             {!isLoading && notes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum item.</p>
             )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
};


export default function Home() {
  const [isNoteFormOpen, setNoteFormOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const { notes, addNote, updateNote, deleteNote, isLoaded, loadNotes } = useNotesStore();
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  const handleAddNew = (category: Category) => {
    setActiveCategory(category);
    setEditingNote(undefined);
    setNoteFormOpen(true);
  };
  
  const handleEdit = (note: Note) => {
    setActiveCategory(note.category as Category);
    setEditingNote(note);
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

  const filterNotesByCategory = (category: Category) => {
    return notes
      .filter(note => note.category === category)
      .sort((a, b) => a.title.localeCompare(b.title));
  };
  
  const handleResetDatabase = async () => {
    setIsResetting(true);
    try {
      await resetDatabaseAction();
      await loadNotes(); // Recarrega as notas do store
      toast({
        title: "Banco de dados reiniciado",
        description: "Os dados foram limpos e recarregados.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível reiniciar o banco de dados.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Todos os Plus</h1>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isResetting}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
                  Limpar e Reiniciar Banco de Dados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                          Essa ação irá apagar TODOS os dados permanentemente e recarregá-los com os valores iniciais. Itens adicionados ou editados por você serão perdidos.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetDatabase} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Sim, Reiniciar
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            <CategoryCard 
              category="Frutas"
              notes={filterNotesByCategory('Frutas')}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
            />
            <CategoryCard 
              category="Legumes e Verduras"
              notes={filterNotesByCategory('Legumes e Verduras')}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
            />
            <CategoryCard 
              category="Outros"
              notes={filterNotesByCategory('Outros')}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
            />
          </div>
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
