'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, Copy, Sparkles, Loader2 } from 'lucide-react';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generatePasswordAction } from '@/app/actions';

const formSchema = z.object({
  length: z.number().min(8).max(128),
  useLowercase: z.boolean(),
  useUppercase: z.boolean(),
  useNumbers: z.boolean(),
  useSymbols: z.boolean(),
}).refine(data => data.useLowercase || data.useUppercase || data.useNumbers || data.useSymbols, {
    message: "At least one character type must be selected.",
    path: ["useLowercase"],
});

type FormValues = z.infer<typeof formSchema>;

interface PasswordGeneratorProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function PasswordGenerator({ isOpen, onOpenChange }: PasswordGeneratorProps) {
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: 16,
      useLowercase: true,
      useUppercase: true,
      useNumbers: true,
      useSymbols: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsGenerating(true);
    setGeneratedPassword('');
    try {
        const result = await generatePasswordAction(values);
        if (result && result.password) {
            setGeneratedPassword(result.password);
        }
    } catch (error) {
        console.error("Failed to generate password", error);
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleCopy = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Strong Password Generator</DialogTitle>
          <DialogDescription>
            Customize and generate a secure, random password using AI.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
             <div className="relative">
                <Input
                    readOnly
                    value={isGenerating ? "Generating..." : generatedPassword}
                    placeholder="Your secure password will appear here"
                    className="pr-10 font-mono"
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleCopy} disabled={!generatedPassword || isGenerating}>
                    {isCopied ? <Check className="h-4 w-4 text-accent-foreground" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                        <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>Password Length</FormLabel>
                            <span className="text-sm font-medium">{field.value}</span>
                        </div>
                        <FormControl>
                            <Slider
                                min={8}
                                max={128}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                 />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="useLowercase"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <FormLabel>Lowercase (a-z)</FormLabel>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="useUppercase"
                        render={({ field }) => (
                             <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <FormLabel>Uppercase (A-Z)</FormLabel>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="useNumbers"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <FormLabel>Numbers (0-9)</FormLabel>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="useSymbols"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <FormLabel>Symbols (!@#)</FormLabel>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                {form.formState.errors.useLowercase && (
                     <p className="text-sm font-medium text-destructive">{form.formState.errors.useLowercase.message}</p>
                )}
                 <DialogFooter>
                    <Button type="submit" className="w-full" disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Password
                    </Button>
                </DialogFooter>
            </form>
            </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
