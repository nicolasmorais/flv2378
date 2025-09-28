
'use server';

import { 
  generateStrongPassword, 
  type GenerateStrongPasswordInput,
  type GenerateStrongPasswordOutput,
} from '@/ai/flows/generate-strong-password';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import type { Note } from '@/lib/types';
import { setupDatabase } from '@/lib/db';

export async function generatePasswordAction(input: GenerateStrongPasswordInput): Promise<GenerateStrongPasswordOutput> {
  try {
    const output = await generateStrongPassword(input);
    return output;
  } catch (error) {
    console.error("Error in generatePasswordAction:", error);
    throw new Error("Failed to generate password.");
  }
}

// Note actions
export async function fetchNotes(): Promise<Note[]> {
  try {
    const { rows } = await sql<Note>`SELECT * FROM notes ORDER BY "createdAt" DESC`;
    return rows;
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    if ((error as any).code === '42P01') {
      console.log("Table 'notes' not found. Returning empty array.");
      return [];
    }
    throw new Error('Failed to fetch notes.');
  }
}

export async function addNoteAction(note: Omit<Note, 'id' | 'createdAt' >) {
  try {
    await sql`
      INSERT INTO notes (title, content, category, description, tags)
      VALUES (${note.title}, ${note.content}, ${note.category}, ${note.description || ''}, ${JSON.stringify(note.tags || [])})
    `;
    revalidatePath('/');
    revalidatePath('/frutas');
    revalidatePath('/folhagem');
    revalidatePath('/verduras-legumes');
    revalidatePath('/plus-pacotes');
    revalidatePath('/plus-cortes');
    revalidatePath('/preco-livre-diario');
    revalidatePath('/anotacoes');
    revalidatePath('/acessos');
  } catch (error) {
    console.error('Failed to add note:', error);
    throw new Error('Failed to add note.');
  }
}

export async function updateNoteAction(id: string, note: Partial<Omit<Note, 'id' | 'createdAt'>>) {
    try {
        await sql`
            UPDATE notes
            SET title = ${note.title}, content = ${note.content}, category = ${note.category}
            WHERE id = ${id}
        `;
        revalidatePath('/');
        revalidatePath('/frutas');
        revalidatePath('/folhagem');
        revalidatePath('/verduras-legumes');
        revalidatePath('/plus-pacotes');
        revalidatePath('/plus-cortes');
        revalidatePath('/preco-livre-diario');
        revalidatePath('/anotacoes');
        revalidatePath('/acessos');
    } catch (error) {
        console.error('Failed to update note:', error);
        throw new Error('Failed to update note.');
    }
}

export async function deleteNoteAction(id: string) {
    try {
        await sql`
            DELETE FROM notes
            WHERE id = ${id}
        `;
        revalidatePath('/');
        revalidatePath('/frutas');
        revalidatePath('/folhagem');
        revalidatePath('/verduras-legumes');
        revalidatePath('/plus-pacotes');
        revalidatePath('/plus-cortes');
        revalidatePath('/preco-livre-diario');
        revalidatePath('/anotacoes');
        revalidatePath('/acessos');
    } catch (error) {
        console.error('Failed to delete note:', error);
        throw new Error('Failed to delete note.');
    }
}

export async function clearAndReseedDatabase() {
  try {
    console.log("Dropping table 'notes'...");
    await sql`DROP TABLE IF EXISTS notes`;
    console.log("Table 'notes' dropped.");
    
    await setupDatabase();

    revalidatePath('/');
    revalidatePath('/frutas');
    revalidatePath('/folhagem');
    revalidatePath('/verduras-legumes');
    revalidatePath('/plus-pacotes');
    revalidatePath('/plus-cortes');
    revalidatePath('/preco-livre-diario');
    revalidatePath('/anotacoes');
    revalidatePath('/acessos');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to clear and re-seed database:', error);
    return { success: false, error: 'Failed to clear and re-seed database.' };
  }
}
