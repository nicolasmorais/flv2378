
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNotesStore } from '@/hooks/use-notes-store';
import { fetchPrices, upsertPriceAction } from '@/app/actions';
import type { Note, Price } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Barcode } from 'lucide-react';
import { debounce } from 'lodash';
import BarcodeGeneratorDialog from '@/components/barcode-generator-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PrecificacaoPage() {
    const { notes, isLoaded: notesLoaded } = useNotesStore();
    const [prices, setPrices] = useState<Record<string, number | null>>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<({plu: string} & Note) | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (notesLoaded) {
                const fetchedPrices = await fetchPrices();
                const pricesMap: Record<string, number | null> = {};
                fetchedPrices.forEach(p => {
                    pricesMap[p.plu] = p.price;
                });
                setPrices(pricesMap);
                setIsLoaded(true);
            }
        };
        loadData();
    }, [notesLoaded]);

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
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSave = useCallback(
        debounce((plu: string, price: number | null) => {
            upsertPriceAction(plu, price === null || isNaN(price) ? null : price);
        }, 500),
        []
    );

    const handlePriceChange = (plu: string, value: string) => {
        const price = value === '' ? null : parseFloat(value);
        setPrices(prev => ({ ...prev, [plu]: price }));
        debouncedSave(plu, price);
    };
    
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
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted text-muted-foreground sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 w-16"></th>
                                    <th className="p-3 w-1/4">Código (PLU)</th>
                                    <th className="p-3 w-3/4">Produto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!isLoaded && [...Array(20)].map((_, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="p-2"><Skeleton className="h-8 w-8" /></td>
                                        <td className="p-2"><Skeleton className="h-6 w-full" /></td>
                                        <td className="p-2"><Skeleton className="h-6 w-full" /></td>
                                    </tr>
                                ))}
                                {isLoaded && filteredProducts.map((product, index) => (
                                    <tr key={product.id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-muted/50'}`}>
                                        <td className="p-2 text-center">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleGenerateBarcode(product)}>
                                                <Barcode className="h-4 w-4" />
                                            </Button>
                                        </td>
                                        <td className="p-3 font-medium">{product.plu}</td>
                                        <td className="p-3 font-medium">{product.title}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {isLoaded && filteredProducts.length === 0 && (
                            <div className="p-4 text-center text-muted-foreground">
                                {searchTerm ? "Nenhum produto encontrado." : "Nenhum produto cadastrado."}
                            </div>
                        )}
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
