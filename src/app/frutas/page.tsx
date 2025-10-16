
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const frutasCitricas = [
  'GRAPEFRUIT IMP GNEL KG',
  'LARANJA BAHIA IMP GNEL',
  'LARANJA LIMA KG',
  'LARANJA PERA GNEL',
  'LARANJA PERA PARA SUCO KG',
  'LIMA DA PÉRSIA GNEL',
  'LIMÃO SICILIANO IMP GNEL',
  'LIMÃO TAHITI GNEL',
  'MARACUJÁ AZEDO GNEL',
  'MINI TANGERINA IMPORTADA KG',
  'QA LARANJA BAHIA 2KG',
  'QA LARANJA LIMA 2KG',
  'QA LARANJA PERA 3KG',
  'QA LIMÃO TAHITI 1KG',
  'TANGELINA PONKAN GNEL',
  'TANGERINA CRAVO GNEL KG',
  'TANGERINA DECOPON',
  'TANGERINA IMPORTADA',
  'TANGERINA MURKOT GNEL',
  'TANGERINA NAC VERONA KG',
  'TANGERINA RIO GNEL KG',
];

const macasEPearas = [
  'MAÇÃ FRANCESA CANDINE IMP CD',
  'MAÇÃ FUJI NAC GNEL',
  'MAÇÃ GALA GNEL',
  'MAÇÃ GOLDEN GNEL KG',
  'MAÇÃ PINK LANDY',
  'MAÇÃ RED IMP GNEL',
  'MAÇÃ VERDE IMP GNEL',
  'PERA RED - D ANJOU IMP GNEL',
  'PERA ABATE FETEL IMP KG - 3247181',
  'PERA ASIÁTICA GNEL',
  'PERA BELGA CONFERENCE IMP',
  'PERA BOSC GNEL KG',
  'PERA D ANJOU IMP GNEL',
  'PERA FORELLE IMP KG',
  'PERA PACKANS IMP GNEL KG',
  'PERA PORTUGUESA ROCHA GNEL',
  'PERA WILLIANS IMP GNEL',
];

const frutasEspeciais = [
  'AMEIXA IMPORTADA KG',
  'AMEIXA ROSADA',
  'ATEMOYA GNEL',
  'AVOCADO GNEL KG',
  'CACAU KG',
  'CAQUI CHOCOLATE GNEL',
  'CAQUI FUYU NACIONAL GNEL',
  'CAQUI IMPORTADO KG',
  'CAQUI RAMAFORTE GNEL',
  'CEREJA IMP KG',
  'DAMASCO GRANEL KG',
  'FRUTA DO CONDE GNEL',
  'GOIABA BRANCA GNEL',
  'GOIABA VERMELHA GNEL',
  'GRANADILLA IMPORTADA CD UN',
  'GRAVIOLA GNEL KG',
  'JAMELÃO',
  'KIWI GOLD ZESPRI',
  'KIWI IMP VERDE GNEL',
  'MANGA BOURBON GNEL',
  'MANGA ESPADA GNEL',
  'MANGA HADEN GNEL',
  'MANGA KEIT GNEL',
  'MANGA PALMER NAC GNEL',
  'MANGA ROSA GNEL',
  'MANGA SHELLY',
  'MANGA TOMMY GNEL',
  'MANGOSTIN KG',
  'NECTARINA IMP GNEL',
  'NECTARINA NAC GNEL KG',
  'NOZES C/CASCA GRANEL IMP',
  'PÊSSEGO IMP GNEL',
  'PÊSSEGO NAC GNEL',
  'PITAYA AMARELA IMP',
  'PITAYA BRANCA',
  'PITAYA VERMELHA',
  'ROMÃ IMP',
  'UVA VITÓRIA GNEL KG',
];

const CategoryCard = ({
  category,
  notes,
  isLoading,
  onEdit,
  onDelete,
}: {
  category: string;
  notes: Note[];
  isLoading: boolean;
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
      <CardHeader>
        <CardTitle className="text-xl">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2 pr-4">
            {isLoading && [...Array(15)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ))}
            {!isLoading && notes.map((note, index) => {
              const pluMatch = note.content.match(/PLU: (.*)/);
              const plu = pluMatch ? pluMatch[1].trim() : '';
              return (
                <div key={note.id} className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                  <div className="flex items-center gap-1 truncate">
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


export default function FrutasPage() {
  const { notes, addNote, updateNote, deleteNote, isLoaded } = useNotesStore();
  const [isNoteFormOpen, setNoteFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const filterNotesByTitle = (titles: string[]) => {
    return notes
      .filter(note => note.category === 'Frutas' && titles.includes(note.title))
      .sort((a, b) => a.title.localeCompare(b.title));
  };
  
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
      category: 'Frutas',
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
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Plus Frutas</h1>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Cadastro
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CategoryCard
                    category="Frutas Cítricas"
                    notes={filterNotesByTitle(frutasCitricas)}
                    isLoading={!isLoaded}
                    onEdit={handleEdit}
                    onDelete={deleteNote}
                />
                 <CategoryCard
                    category="Maçãs e Pêras"
                    notes={filterNotesByTitle(macasEPearas)}
                    isLoading={!isLoaded}
                    onEdit={handleEdit}
                    onDelete={deleteNote}
                />
                <CategoryCard
                    category="FRUTAS ESPECIAIS"
                    notes={filterNotesByTitle(frutasEspeciais)}
                    isLoading={!isLoaded}
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
        activeCategory="Frutas"
      />
    </div>
  );
}

    