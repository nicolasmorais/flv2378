
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Note } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  title: z.string().min(1, 'Nome é obrigatório'),
  plu: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().min(1, 'Categoria é obrigatória'),
});

type FormValues = z.infer<typeof formSchema>;

interface NoteFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  note?: Note;
  onSave: (data: Omit<Note, 'id' | 'createdAt' | 'tags' | 'description' | 'content'> & { plu: string; barcode: string; category: string; }) => void;
  activeCategory: string | null;
  showCategorySelector?: boolean;
}

const categories = [
    "Frutas",
    "Legumes e Verduras",
    "Folhagem",
    "Plus/Pacotes",
    "Plus/Cortes",
    "Outros",
    "Preço Livre Diário"
];

export default function NoteForm({ isOpen, onOpenChange, note, onSave, activeCategory, showCategorySelector = false }: NoteFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      plu: '',
      barcode: '',
      category: activeCategory || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (note) {
        const pluMatch = note.content.match(/PLU: (.*)/);
        const barcodeMatch = note.content.match(/Barcode: (.*)/);
        form.reset({
          title: note.title,
          plu: pluMatch ? pluMatch[1].trim() : '',
          barcode: barcodeMatch ? barcodeMatch[1].trim() : '',
          category: note.category,
        });
      } else {
        form.reset({
          title: '',
          plu: '',
          barcode: '',
          category: activeCategory || '',
        });
      }
    }
  }, [note, form, isOpen, activeCategory]);

  const onSubmit = (values: FormValues) => {
    onSave({
      title: values.title,
      plu: values.plu || '',
      barcode: values.barcode || '',
      category: values.category,
    });
  };
  
  const dialogTitle = note ? `Editar em ${note.category}` : `Cadastrar em ${activeCategory || 'Nova Categoria'}`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{showCategorySelector ? (note ? 'Editar Produto' : 'Novo Produto') : dialogTitle}</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Maçã Gala" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showCategorySelector && (
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            <FormField
              control={form.control}
              name="plu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PLU</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 4016" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Barras</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 7891234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
