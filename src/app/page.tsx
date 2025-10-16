
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Copy, Check, MoreVertical, Edit, Trash2, RotateCcw } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { clearAndReseedDatabase } from '@/app/actions';

type Category = 'Frutas' | 'Legumes e Verduras' | 'Outros' | 'Plus/Pacotes' | 'Plus/Cortes';

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
        <ScrollArea className="h-[34rem]">
          <div className="space-y-2 pr-4">
            {isLoading && [...Array(14)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ))}
            {!isLoading && notes.map(note => {
               const pluMatch = note.content.match(/PLU: (.*)/);
               const plu = pluMatch ? pluMatch[1].trim() : '';
               return (
                <div key={note.id} className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                  <div className="flex items-center gap-2 truncate">
                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => handleCopy(plu)}>
                      {copiedPlu === plu ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <div className="truncate flex items-baseline gap-2">
                        <span className="font-mono text-2xl font-bold">{plu}</span>
                        <span className="font-medium text-base uppercase">{note.title.toUpperCase()}</span>
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

  const handleClearDatabase = async () => {
    const result = await clearAndReseedDatabase();
    if (result.success) {
      await loadNotes();
    } else {
      // Handle error, maybe show a toast
      console.error(result.error);
    }
  };

  const filterNotesByCategory = (category: Category) => {
    return notes
      .filter(note => note.category === category)
      .sort((a, b) => a.title.localeCompare(b.title));
  };

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Todos os Plus</h1>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação irá apagar todos os dados atuais e recarregar os produtos iniciais. Todas as alterações, adições ou exclusões que você fez serão perdidas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearDatabase} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Sim, limpar e reiniciar
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
             <CategoryCard 
              category="Plus/Pacotes"
              notes={filterNotesByCategory('Plus/Pacotes')}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
            />
             <CategoryCard 
              category="Plus/Cortes"
              notes={filterNotesByCategory('Plus/Cortes')}
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
