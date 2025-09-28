
'use client';

import { useState } from 'react';
import { useAccessStore } from '@/hooks/use-access-store';
import type { Access } from '@/lib/types';
import AccessForm from '@/components/access-form';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, MoreVertical, Edit, Trash2, Copy, Check } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const CopyableField = ({ label, value }: { label: string, value: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2 text-sm">
            <p className="font-medium truncate">
                <span className="text-muted-foreground">{label}: </span>
                <span className="font-mono">{value}</span>
            </p>
            <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
        </div>
    );
};

export default function AcessosPage() {
  const { accesses, addAccess, updateAccess, deleteAccess, isLoaded } = useAccessStore();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingAccess, setEditingAccess] = useState<Access | undefined>(undefined);

  const handleEdit = (access: Access) => {
    setEditingAccess(access);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingAccess(undefined);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingAccess(undefined);
  };

  const handleSaveAccess = (accessData: Omit<Access, 'id' | 'createdAt'>) => {
    if (editingAccess) {
      updateAccess(editingAccess.id, accessData);
    } else {
      addAccess(accessData);
    }
    handleFormClose();
  };

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Acessos</h1>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Acesso
            </Button>
          </div>

          <div className="flex-1">
            {!isLoaded && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {isLoaded && accesses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accesses.map(access => (
                  <Card key={access.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                             <p className="text-xs text-muted-foreground pt-1">
                                {new Date(access.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 -mt-1 -mr-2">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(access)}>
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
                                                Essa ação não pode ser desfeita. Isso irá deletar o acesso permanentemente.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteAccess(access.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Deletar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-2">
                        <CopyableField label="Link" value={access.link} />
                        <CopyableField label="Usuário" value={access.username} />
                        <CopyableField label="Senha" value={access.password} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {isLoaded && accesses.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-muted-foreground">
                  Nenhum acesso encontrado
                </h3>
                <p className="text-muted-foreground mt-2">
                  Clique em "Novo Acesso" para começar.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <AccessForm
        isOpen={isFormOpen}
        onOpenChange={handleFormClose}
        access={editingAccess}
        onSave={handleSaveAccess}
      />
    </div>
  );
}

    