
'use client';

import { useState, useMemo } from 'react';
import { useNotesStore } from '@/hooks/use-notes-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, Check, Search, Barcode, MoreVertical, Edit, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BarcodeGeneratorDialog from '@/components/barcode-generator-dialog';
import NoteForm from '@/components/note-form';
import type { Note } from '@/lib/types';
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

export default function TodosOsPlusPage() {
    const { notes, addNote, updateNote, deleteNote, isLoaded } = useNotesStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedPlu, setCopiedPlu] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<({plu: string} & Note) | null>(null);
    const [isNoteFormOpen, setNoteFormOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
    const { toast } = useToast();

    const products = useMemo(() => {
        return notes
            .map(note => {
                const pluMatch = note.content.match(/PLU: (.*)/);
                const plu = pluMatch ? pluMatch[1].trim() : '';
                const barcodeMatch = note.content.match(/Barcode: (.*)/);
                const barcode = barcodeMatch ? barcodeMatch[1].trim() : '';
                return { ...note, plu, barcode };
            })
            .filter(note => note.plu) // Only include items with a PLU
            .sort((a, b) => a.title.localeCompare(b.title));
    }, [notes]);
    
    const filteredProducts = useMemo(() => {
        if (!searchTerm) {
            return products;
        }
        return products.filter(p => 
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.plu.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const handleCopy = (plu: string) => {
        navigator.clipboard.writeText(plu);
        setCopiedPlu(plu);
        toast({
            title: "PLU Copiado!",
            description: `O código ${plu} foi copiado para a área de transferência.`,
        });
        setTimeout(() => setCopiedPlu(null), 2000);
    };

    const handleGenerateBarcode = (product: ({plu: string} & Note)) => {
        setSelectedProduct(product);
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

    const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'tags' | 'description' | 'content'> & { plu: string; barcode: string; category: string; }) => {
        const noteToSave = {
            title: noteData.title,
            content: `PLU: ${noteData.plu}\nBarcode: ${noteData.barcode}`,
            category: noteData.category,
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
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh_-_var(--header-height,0px))] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Todos os Plus</h1>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Novo Cadastro
                    </Button>
                </div>
                <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Buscar por PLU ou nome do produto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10"
                    />
                </div>
                <div className="flex-1 border rounded-lg overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-2">
                            {!isLoaded && [...Array(20)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                                    <Skeleton className="h-5 w-full" />
                                </div>
                            ))}
                            {isLoaded && filteredProducts.map((product) => {
                                const plu = product.plu;
                                return (
                                <div key={product.id} className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                                    <div className="flex items-center gap-2 truncate">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => handleGenerateBarcode(product)}>
                                            <Barcode className="h-4 w-4" />
                                        </Button>
                                        <div className="truncate">
                                            <span className="font-medium text-sm">{plu} - {product.title.toUpperCase()}</span>
                                        </div>
                                    </div>
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
                                                <DropdownMenuItem onClick={() => handleEdit(product)}>
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
                                                            <AlertDialogAction onClick={() => deleteNote(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
                            {isLoaded && filteredProducts.length === 0 && (
                                <div className="text-center py-20">
                                    <h3 className="text-xl font-semibold text-muted-foreground">
                                        {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
                                    </h3>
                                    <p className="text-muted-foreground mt-2">
                                        {searchTerm ? "Tente um termo de busca diferente." : "Cadastre novos produtos para vê-los aqui."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <BarcodeGeneratorDialog 
                isOpen={!!selectedProduct}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setSelectedProduct(null);
                    }
                }}
                product={selectedProduct}
            />
            <NoteForm
                isOpen={isNoteFormOpen}
                onOpenChange={handleNoteFormClose}
                note={editingNote}
                onSave={handleSaveNote}
                activeCategory={editingNote?.category || null}
                showCategorySelector={true}
            />
        </>
    );
}
