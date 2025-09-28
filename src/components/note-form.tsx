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

const formSchema = z.object({
  title: z.string().min(1, 'Nome é obrigatório'),
  plu: z.string().optional(),
  barcode: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NoteFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  note?: Note;
  onSave: (data: Omit<Note, 'id' | 'createdAt' | 'category' | 'tags' | 'description' | 'content'> & { plu: string; barcode: string; }) => void;
  activeCategory: string | null;
}

export default function NoteForm({ isOpen, onOpenChange, note, onSave, activeCategory }: NoteFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      plu: '',
      barcode: '',
    },
  });

  useEffect(() => {
    if (note) {
      const pluMatch = note.content.match(/PLU: (.*)/);
      const barcodeMatch = note.content.match(/Barcode: (.*)/);
      form.reset({
        title: note.title,
        plu: pluMatch ? pluMatch[1] : '',
        barcode: barcodeMatch ? barcodeMatch[1] : '',
      });
    } else {
      form.reset({
        title: '',
        plu: '',
        barcode: '',
      });
    }
  }, [note, form, isOpen]);

  const onSubmit = (values: FormValues) => {
    onSave({
      title: values.title,
      plu: values.plu || '',
      barcode: values.barcode || '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Cadastrar em {activeCategory}</DialogTitle>
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
