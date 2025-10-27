
'use client';

import { useState, useMemo } from 'react';
import { useNotesStore } from '@/hooks/use-notes-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, Check, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TodosOsPlusPage() {
    const { notes, isLoaded } = useNotesStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedPlu, setCopiedPlu] = useState<string | null>(null);
    const { toast } = useToast();

    const products = useMemo(() => {
        return notes
            .map(note => {
                const pluMatch = note.content.match(/PLU: (.*)/);
                const plu = pluMatch ? pluMatch[1].trim() : '';
                return { ...note, plu };
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

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh_-_var(--header-height,0px))] flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Todos os Plus</h1>
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
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-7 w-7" />
                            </div>
                        ))}
                        {isLoaded && filteredProducts.map((product, index) => {
                             const plu = product.plu;
                             return (
                              <div key={product.id} className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2">
                                <div className="flex items-center gap-2 truncate">
                                   <div className="flex items-center">
                                        <span className="w-8 text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                    </div>
                                  <div className="truncate">
                                    <span className="font-mono text-sm font-bold">{plu}</span>
                                    <span className="font-medium text-sm uppercase text-muted-foreground"> - {product.title.toUpperCase()}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => handleCopy(plu)}>
                                        {copiedPlu === plu ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
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
    );
}
