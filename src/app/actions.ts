
'use server';

import { 
  generateStrongPassword, 
  type GenerateStrongPasswordInput,
  type GenerateStrongPasswordOutput,
} from '@/ai/flows/generate-strong-password';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import type { Note, Balance, Price } from '@/lib/types';
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
    revalidatePath('/precificacao');
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
        revalidatePath('/precificacao');
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
        revalidatePath('/precificacao');
    } catch (error) {
        console.error('Failed to delete note:', error);
        throw new Error('Failed to delete note.');
    }
}

export async function clearAndReseedDatabase() {
  try {
    console.log("Deleting all records from 'notes' table...");
    await sql`DELETE FROM notes`;
    console.log("All records from 'notes' table deleted.");
    
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
    revalidatePath('/precificacao');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to clear and re-seed database:', error);
    return { success: false, error: 'Failed to clear and re-seed database.' };
  }
}


// Balance actions
export async function fetchBalancesByDate(date: string): Promise<Balance[]> {
    try {
        const { rows } = await sql<Balance>`SELECT * FROM balances WHERE date = ${date}`;
        return rows;
    } catch (error) {
        console.error('Failed to fetch balances:', error);
        if ((error as any).code === '42P01') { // table does not exist
            console.log('Table balances not found, returning empty');
            return [];
        }
        throw new Error('Failed to fetch balances.');
    }
}

export async function upsertBalanceAction(plu: string, kg: number | null, date: string) {
    try {
        await sql`
            INSERT INTO balances (plu, kg, date) 
            VALUES (${plu}, ${kg}, ${date})
            ON CONFLICT (plu, date) 
            DO UPDATE SET kg = EXCLUDED.kg, "updatedAt" = NOW()`;
        
        revalidatePath('/balanco');
    } catch (error) {
        console.error('Failed to upsert balance:', error);
        throw new Error('Failed to upsert balance.');
    }
}

// Price actions
export async function fetchPrices(): Promise<Price[]> {
    try {
        const { rows } = await sql<Price>`SELECT * FROM prices`;
        return rows;
    } catch (error) {
        console.error('Failed to fetch prices:', error);
        if ((error as any).code === '42P01') { // table does not exist
            console.log('Table prices not found, returning empty');
            return [];
        }
        throw new Error('Failed to fetch prices.');
    }
}

export async function upsertPriceAction(plu: string, price: number | null) {
    try {
        await sql`
            INSERT INTO prices (plu, price)
            VALUES (${plu}, ${price})
            ON CONFLICT (plu)
            DO UPDATE SET price = EXCLUDED.price, "updatedAt" = NOW()`;

        revalidatePath('/precificacao');
    } catch (error) {
        console.error('Failed to upsert price:', error);
        throw new Error('Failed to upsert price.');
    }
}
