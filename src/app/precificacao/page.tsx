
'use client';

import { useState, useMemo } from 'react';
import { useNotesStore } from '@/hooks/use-notes-store';
import type { Note } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import BarcodeGeneratorDialog from '@/components/barcode-generator-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PrecificacaoPage() {
    const { notes, isLoaded: notesLoaded } = useNotesStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<({plu: string} & Note) | null>(null);

    const products = useMemo(() => {
        return notes
            .map(note => {
                const pluMatch = note.content.match(/PLU: (.*)/);
                const plu = pluMatch ? pluMatch[1].trim() : '';
                return { ...note, plu };
            })
            .filter(note => note.plu)
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
    
    const handleGenerateBarcode = (product: ({plu: string} & Note)) => {
        setSelectedProduct(product);
    };

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh_-_var(--header-height,0px))] flex flex-col">
                <h1 className="text-2xl font-bold mb-4">Precificação de Produtos</h1>
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
                            {!notesLoaded && [...Array(20)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            ))}
                            {notesLoaded && filteredProducts.map((product) => (
                                <div 
                                    key={product.id} 
                                    className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                                    onClick={() => handleGenerateBarcode(product)}
                                >
                                    <div className="truncate">
                                        <p className="font-medium text-sm truncate">{product.plu} - {product.title.toUpperCase()}</p>
                                    </div>
                                </div>
                            ))}
                            {notesLoaded && filteredProducts.length === 0 && (
                                <div className="p-4 text-center text-muted-foreground">
                                    {searchTerm ? "Nenhum produto encontrado." : "Nenhum produto cadastrado."}
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
        </>
    );
}
