'use client';

import { useState } from 'react';
import {
  Copy,
  Check,
  Tag,
  Folder,
  Trash2,
  Edit,
  MoreVertical,
} from 'lucide-react';
import type { Note } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from "@/components/ui/alert-dialog"

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (contentToCopy: string) => {
    navigator.clipboard.writeText(contentToCopy);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  const pluMatch = note.content.match(/PLU: (.*)/);
  const barcodeMatch = note.content.match(/Barcode: (.*)/);
  const plu = pluMatch ? pluMatch[1] : '';
  const barcode = barcodeMatch ? barcodeMatch[1] : '';

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start justify-between pb-4">
        <div className="space-y-1.5">
          <CardTitle className="text-lg">{note.title}</CardTitle>
          {note.category && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Folder className="h-3 w-3 mr-1.5" />
              <span>{note.category}</span>
            </div>
          )}
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
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
                                Essa ação não pode ser desfeita. Isso irá deletar a nota permanentemente.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Deletar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {plu && (
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
              <p className="font-medium text-sm mr-2">PLU</p>
              <p className="flex-1 text-sm font-mono truncate">{plu}</p>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(plu)}>
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
        )}
        {barcode && (
           <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
              <p className="font-medium text-sm mr-2">Cód. Barras</p>
              <p className="flex-1 text-sm font-mono truncate">{barcode}</p>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(barcode)}>
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
        )}
      </CardContent>
      <CardFooter>
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <Tag className="h-3 w-3 text-muted-foreground"/>
            {note.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
