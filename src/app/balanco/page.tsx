
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNotesStore } from '@/hooks/use-notes-store';
import { fetchBalancesByDate, upsertBalanceAction } from '@/app/actions';
import type { Note, Balance } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, Check, Search } from 'lucide-react';
import { debounce } from 'lodash';

const getTodayDateString = () => {
    const today = new Date();
    // Adjust for timezone offset to get local date
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - (offset*60*1000));
    return localToday.toISOString().split('T')[0];
}

export default function BalancoPage() {
    const { notes, isLoaded: notesLoaded } = useNotesStore();
    const [balances, setBalances] = useState<Record<string, number | null>>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [summaryText, setSummaryText] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    const today = getTodayDateString();

    useEffect(() => {
        const loadData = async () => {
            if (notesLoaded) {
                const fetchedBalances = await fetchBalancesByDate(today);
                const balancesMap: Record<string, number | null> = {};
                fetchedBalances.forEach(b => {
                    balancesMap[b.plu] = b.kg;
                });
                setBalances(balancesMap);
                setIsLoaded(true);
            }
        };
        loadData();
    }, [notesLoaded, today]);

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
        debounce((plu: string, kg: number | null) => {
            upsertBalanceAction(plu, kg === null || isNaN(kg) ? null : kg, today);
        }, 500),
        [today]
    );

    const handleKgChange = (plu: string, value: string) => {
        const kg = value === '' ? null : parseFloat(value);
        setBalances(prev => ({ ...prev, [plu]: kg }));
        debouncedSave(plu, kg);
    };

    useEffect(() => {
        const summary = products
            .filter(p => balances[p.plu] !== null && balances[p.plu] !== undefined && !isNaN(Number(balances[p.plu])))
            .map(p => `${p.plu} - ${balances[p.plu]}`)
            .join('\n');
        setSummaryText(summary);
    }, [balances, products]);


    const handleCopy = () => {
        navigator.clipboard.writeText(summaryText);
        setIsCopied(true);
        toast({
            title: "Copiado com sucesso!",
            description: "Os dados do balanço foram copiados para a área de transferência.",
        });
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-6">Balanço FLV</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-lg font-semibold mb-4">Lançamento de Estoque (kg)</h2>
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
                    <div className="border rounded-lg overflow-hidden">
                        <div className="h-[calc(60vh_-_48px)] overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted text-muted-foreground sticky top-0">
                                    <tr>
                                        <th className="p-3 w-1/4">Código (PLU)</th>
                                        <th className="p-3 w-1/2">Produto</th>
                                        <th className="p-3 w-1/4">Estoque (kg)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!isLoaded && [...Array(20)].map((_, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="p-2"><Skeleton className="h-6 w-full" /></td>
                                            <td className="p-2"><Skeleton className="h-6 w-full" /></td>
                                            <td className="p-2"><Skeleton className="h-8 w-full" /></td>
                                        </tr>
                                    ))}
                                    {isLoaded && filteredProducts.map((product, index) => (
                                        <tr key={product.id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-muted/50'}`}>
                                            <td className="p-3 font-medium">{product.plu}</td>
                                            <td className="p-3 font-medium">{product.title}</td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    value={balances[product.plu] ?? ''}
                                                    onChange={(e) => handleKgChange(product.plu, e.target.value)}
                                                    className="w-full h-8 text-center"
                                                    placeholder="kg"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {isLoaded && filteredProducts.length === 0 && (
                                <div className="p-4 text-center text-muted-foreground">
                                    {searchTerm ? "Nenhum produto encontrado." : "Nenhum produto cadastrado."}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Resumo do Balanço</h2>
                     <div className="relative">
                        <Textarea
                            readOnly
                            value={summaryText}
                            className="h-[60vh] font-mono text-sm resize-none"
                            placeholder="Produtos com estoque preenchido aparecerão aqui..."
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleCopy}
                            disabled={!summaryText}
                            className="absolute top-2 right-2 h-8 w-8"
                        >
                           {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
