
'use client';

import { useState, useMemo } from 'react';
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

type Category = 'Frutas' | 'Legumes e Verduras' | 'Outros' | 'Plus/Pacotes' | 'Plus/Cortes' | 'Folhagem' | 'Preço Livre Diário';

const frutasCitricas = [
  'GRAPEFRUIT IMP GNEL KG', 'LARANJA BAHIA IMP GNEL', 'LARANJA LIMA KG', 'LARANJA PERA GNEL', 
  'LARANJA PERA PARA SUCO KG', 'LIMA DA PÉRSIA GNEL', 'LIMÃO SICILIANO IMP GNEL', 'LIMÃO TAHITI GNEL', 
  'MARACUJÁ AZEDO GNEL', 'MINI TANGERINA IMPORTADA KG', 'QA LARANJA BAHIA 2KG', 'QA LARANJA LIMA 2KG', 
  'QA LARANJA PERA 3KG', 'QA LIMÃO TAHITI 1KG', 'TANGELINA PONKAN GNEL', 'TANGERINA CRAVO GNEL KG', 
  'TANGERINA DECOPON', 'TANGERINA IMPORTADA', 'TANGERINA MURKOT GNEL', 'TANGERINA NAC VERONA KG', 'TANGERINA RIO GNEL KG'
];

const macasEPearas = [
  'MAÇÃ FRANCESA CANDINE IMP CD', 'MAÇÃ FUJI NAC GNEL', 'MAÇÃ GALA GNEL', 'MAÇÃ GOLDEN GNEL KG', 
  'MAÇÃ PINK LANDY', 'MAÇÃ RED IMP GNEL', 'MAÇÃ VERDE IMP GNEL', 'PERA RED - D ANJOU IMP GNEL', 
  'PERA ABATE FETEL IMP KG - 3247181', 'PERA ASIÁTICA GNEL', 'PERA BELGA CONFERENCE IMP', 'PERA BOSC GNEL KG', 
  'PERA D ANJOU IMP GNEL', 'PERA FORELLE IMP KG', 'PERA PACKANS IMP GNEL KG', 'PERA PORTUGUESA ROCHA GNEL', 'PERA WILLIANS IMP GNEL'
];

const frutasEspeciais = [
  'AMEIXA IMPORTADA KG', 'AMEIXA ROSADA', 'ATEMOYA GNEL', 'AVOCADO GNEL KG', 'CACAU KG', 
  'CAQUI CHOCOLATE GNEL', 'CAQUI FUYU NACIONAL GNEL', 'CAQUI IMPORTADO KG', 'CAQUI RAMAFORTE GNEL', 
  'CEREJA IMP KG', 'DAMASCO GRANEL KG', 'FRUTA DO CONDE GNEL', 'GOIABA BRANCA GNEL', 'GOIABA VERMELHA GNEL', 
  'GRANADILLA IMPORTADA CD UN', 'GRAVIOLA GNEL KG', 'JAMELÃO', 'KIWI GOLD ZESPRI', 'KIWI IMP VERDE GNEL', 
  'MANGA BOURBON GNEL', 'MANGA ESPADA GNEL', 'MANGA HADEN GNEL', 'MANGA KEIT GNEL', 'MANGA PALMER NAC GNEL', 
  'MANGA ROSA GNEL', 'MANGA SHELLY', 'MANGA TOMMY GNEL', 'MANGOSTIN KG', 'NECTARINA IMP GNEL', 
  'NECTARINA NAC GNEL KG', 'NOZES C/CASCA GRANEL IMP', 'PÊSSEGO IMP GNEL', 'PÊSSEGO NAC GNEL', 
  'PITAYA AMARELA IMP', 'PITAYA BRANCA', 'PITAYA VERMELHA', 'ROMÃ IMP', 'UVA VITÓRIA GNEL KG'
];

const frutasTropicais = [
  'ABACAXI GOLD', 'ABACAXI HAWAI', 'ABACAXI PÉROLA', 'CASTANHA PORTUGUESA GNEL', 'COCO SECO GNEL', 
  'COCO VERDE', 'COCO VERDE PARA GARRAFA UN', 'MELANCIA AMARELA KG', 'MELANCIA BABY', 'MELANCIA GRANEL KG', 
  'MELANCIA MAGALI KG', 'MELANCIA PINGO DOCE KG', 'MELANCIA SOLINDA (PERSONAL)', 'MELÃO AMARELO NAC GNEL', 
  'MELÃO AMARELO REI KG', 'MELÃO CANTALOUP NAC GNEL KG', 'MELÃO CHARANTEAIS GNEL', 'MELÃO DINO KG', 
  'MELÃO FORMOSA GNEL KG', 'MELÃO GALIA GNEL', 'MELÃO MELUNA KG', 'MELÃO ORANGE GNEL', 
  'MELÃO PELE DE SAPO REI GNEL', 'MELÃO VERDE GNEL', 'QA MELÃO AMARELO KG', 'TÂMARA A GRANEL KG', 
  'UVA CLARA S/SEMENTE CD KG', 'UVA VERMELHA S/SEMENTE KG',
  'MAMAO PAPAYA SUNRISE 1,2KG',
  'ABACATE GNEL',
  'BANANA MAÇA GNEL',
  'BANANA NANICA GNEL',
  'BANANA OURO GNEL KG',
  'BANANA PRATA GNEL',
  'BANANA TERRA GNEL',
  'MAMAO FORMOSA GNEL',
  'MAMAO PAPAYA GOLDEN GNEL',
  'MAMAO PAPAYA SUNRISE 1,8KG',
  'QA MAMAO PAPAYA GOLDEN 1.5 QUALITÁ',
];

const tomates = [
    'QA TOMATE CARM 600G', 'QA TOMATE CEREJA 200G', 'QA TOMATE CEREJA RAMA 200G', 'QA TOMATE GRAPE 150G',
    'QA TOMATE GRAPE 500G', 'QA TOMATE ITAL 500G', 'QA TOMATE ITALIANO 1KG', 'QA TOMATE KIDS SWEET GRAPE',
    'QA TOMATE P/MOLHO 600G', 'TOMATE AMARELO', 'TOMATE ANDREA 600G', 'TOMATE CAQUI GNEL KG',
    'TOMATE CEREJA RAMA', 'TOMATE CEREJA VERMELHO', 'TOMATE COMUM GRANEL', 'TOMATE FONTE CORAÇÃO KG',
    'TOMATE FONTE VERDE KG', 'TOMATE GRAPE', 'TOMATE ITALIANO GNEL', 'TOMATE S GRAPE T DA MÔNICA'
];

const aboboras = [
    'ABÓBORA BATÁ KG', 'ABÓBORA JAPONESA GNEL', 'ABÓBORA MORANGA GNEL', 'ABÓBORA PAULISTA GNEL', 'ABÓBORA SECA GNEL'
];

const legumesETuberculos = [
    'ABOBRINHA ITALIANA GNEL', 'ABOBRINHA BRASIL EXTRA GNEL', 'ALCACHOFRA UN', 'ALHO DENTE POTE', 'ALHO GRAÚDO GNEL',
    'BATATA ASTERIX', 'BATATA COMUM GNEL', 'BATATA DOCE BRANCA GNEL', 'BATATA DOCE ROSADA GNEL', 'BETERRABA EXTRA GNEL',
    'BERINJELA GNEL', 'CARÁ GNEL', 'CENOURA GNEL', 'CEBOLA BRANCA IMP KG', 'CEBOLA GRANEL', 'CEBOLA ROXA GNEL',
    'CHUCHU EXTRA GNEL', 'GENGIBRE GNEL', 'INHAME GNEL', 'MANDIOCA GNEL', 'MANDIOQUINHA GNEL', 'PEPINO JAPONÊS EXTRA GNEL',
    'PEPINO COMUM EXTRA GNEL', 'PEPINO CAIPIRA GRANEL', 'PIMENTÃO VERMELHO GNEL', 'PIMENTÃO VERDE EXTRA GNEL',
    'PIMENTÃO AMARELO GNEL', 'PINHÃO KG', 'REPOLHO ROXO GNEL', 'REPOLHO VERDE GNEL', 'VAGEM MACARRÃO EXTRA GNEL'
];

const cogumelos = [
    'COGUMELO PARIS KG', 'COGUMELO SHITAKE KG', 'COGUMELO SHIMEJI BRANCO KG', 'COGUMELO PORTOBELO KG'
];

const CategoryCard = ({ 
  category, 
  notes, 
  isLoading, 
  onAddNew,
  onEdit,
  onDelete,
  mainCategory,
}: { 
  category: string;
  notes: Note[];
  isLoading: boolean;
  onAddNew: (category: Category) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  mainCategory: Category;
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
        <Button size="sm" onClick={() => onAddNew(mainCategory)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2 pr-4">
            {isLoading && [...Array(14)].map((_, i) => (
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
                      <span className="font-mono text-sm font-bold">{plu}</span>
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


export default function DashboardPage() {
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
      console.error(result.error);
    }
  };

  const filterNotesByCategory = (category: Category) => {
    return notes
      .filter(note => note.category === category)
      .sort((a, b) => a.title.localeCompare(b.title));
  };
  
  const filterNotesByTitle = (mainCategory: Category, titles: string[]) => {
    return notes
      .filter(note => note.category === mainCategory && titles.includes(note.title))
      .sort((a, b) => a.title.localeCompare(b.title));
  };

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            <CategoryCard 
              category="Frutas Cítricas"
              notes={filterNotesByTitle('Frutas', frutasCitricas)}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
              mainCategory="Frutas"
            />
            <CategoryCard 
              category="Maçãs e Pêras"
              notes={filterNotesByTitle('Frutas', macasEPearas)}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
              mainCategory="Frutas"
            />
            <CategoryCard 
              category="Frutas Especiais"
              notes={filterNotesByTitle('Frutas', frutasEspeciais)}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
              mainCategory="Frutas"
            />
            <CategoryCard 
              category="Frutas Tropicais"
              notes={filterNotesByTitle('Frutas', frutasTropicais)}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
              mainCategory="Frutas"
            />
            <CategoryCard 
              category="Tomates"
              notes={filterNotesByTitle('Legumes e Verduras', tomates)}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
              mainCategory="Legumes e Verduras"
            />
            <CategoryCard 
              category="Abóboras"
              notes={filterNotesByTitle('Legumes e Verduras', aboboras)}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
              mainCategory="Legumes e Verduras"
            />
            <CategoryCard d
              category="Legumes e Tubérculos"
              notes={filterNotesByTitle('Legumes e Verduras', legumesETuberculos)}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
              mainCategory="Legumes e Verduras"
            />
            <CategoryCard 
              category="Cogumelos a Granel"
              notes={filterNotesByTitle('Legumes e Verduras', cogumelos)}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
              mainCategory="Legumes e Verduras"
            />
            <CategoryCard 
              category="Plus/Pacotes"
              notes={filterNotesByCategory('Plus/Pacotes')}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
              mainCategory="Plus/Pacotes"
            />
             <CategoryCard 
              category="Plus/Cortes"
              notes={filterNotesByCategory('Plus/Cortes')}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
              mainCategory="Plus/Cortes"
            />
            <CategoryCard 
              category="Folhagem"
              notes={filterNotesByCategory('Folhagem')}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
              mainCategory="Folhagem"
            />
            <CategoryCard 
              category="Outros"
              notes={filterNotesByCategory('Outros')}
              isLoading={!isLoaded}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={deleteNote}
              mainCategory="Outros"
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
