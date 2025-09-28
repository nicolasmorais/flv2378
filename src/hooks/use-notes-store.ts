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
  getAnnotations: () => Note[];
}

const useNotesStoreInternal = create<NotesStore>((set, get) => ({
  notes: [],
  isLoaded: false,
  setNotes: (notes) => set({ notes, isLoaded: true }),
  loadNotes: async () => {
    try {
      set({ isLoaded: false }); 
      const notes = await fetchNotes();
      set({ notes, isLoaded: true });
    } catch (error) {
      console.error("Failed to load notes:", error);
      set({ isLoaded: true });
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
  getAnnotations: () => {
    return get().notes.filter(note => note.category === 'Anotação').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}));

export const useNotesStore = () => {
    const store = useNotesStoreInternal();
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        store.loadNotes().then(() => {
            setHasHydrated(true);
        });
    }, []);

    const loadNotes = async () => {
        await store.loadNotes();
    }
    
    const getAnnotations = () => {
        return store.getAnnotations();
    }

    return { ...store, isLoaded: hasHydrated, loadNotes, getAnnotations };
};
