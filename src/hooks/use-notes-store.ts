'use client';

import { create } from 'zustand';
import type { Note } from '@/lib/types';
import { useEffect, useState } from 'react';
import { fetchNotes, addNoteAction, updateNoteAction, deleteNoteAction } from '@/app/actions';

interface NotesStore {
  notes: Note[];
  isLoaded: boolean;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  updateNote: (id: string, note: Partial<Omit<Note, 'id' | 'createdAt'>>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  loadNotes: () => Promise<void>;
}

const useNotesStoreInternal = create<NotesStore>((set, get) => ({
  notes: [],
  isLoaded: false,
  setNotes: (notes) => set({ notes, isLoaded: true }),
  loadNotes: async () => {
    try {
      const notes = await fetchNotes();
      set({ notes, isLoaded: true });
    } catch (error) {
      console.error("Failed to load notes:", error);
      set({ isLoaded: true }); // Mark as loaded even if there's an error
    }
  },
  addNote: async (note) => {
    await addNoteAction(note);
    await get().loadNotes();
  },
  updateNote: async (id, note) => {
    await updateNoteAction(id, note);
    await get().loadNotes();
  },
  deleteNote: async (id) => {
    await deleteNoteAction(id);
    await get().loadNotes();
  },
}));

export const useNotesStore = () => {
    const store = useNotesStoreInternal();
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        store.loadNotes().then(() => {
            setHasHydrated(true);
        });
    }, []);

    return { ...store, isLoaded: hasHydrated };
};
