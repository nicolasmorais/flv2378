'use client';

import { create } from 'zustand';
import type { Note } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { fetchNotes, addNoteAction, updateNoteAction, deleteNoteAction } from '@/app/actions';

interface NotesStoreState {
  notes: Note[];
  isLoaded: boolean;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  updateNote: (id: string, note: Partial<Omit<Note, 'id' | 'createdAt'>>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  loadNotes: () => Promise<void>;
}

const useNotesStoreInternal = create<NotesStoreState>((set, get) => ({
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
}));

// We separate the state access from the actions.
// This allows components to subscribe only to the state they need.
export const useNotesState = () => {
  return useNotesStoreInternal((state) => ({
    notes: state.notes,
    isLoaded: state.isLoaded,
  }));
};

// This hook provides the actions and handles initial data loading.
// It doesn't return state, so it won't cause re-renders when state changes.
export const useNotesActions = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const actions = useNotesStoreInternal((state) => ({
    loadNotes: state.loadNotes,
    addNote: state.addNote,
    updateNote: state.updateNote,
    deleteNote: state.deleteNote,
  }));

  useEffect(() => {
    if (!isInitialized) {
      actions.loadNotes();
      setIsInitialized(true);
    }
  }, [actions, isInitialized]);

  return actions;
};


// A combined hook for convenience, but it's often better to use the two above separately.
export const useNotesStore = () => {
  const state = useNotesState();
  const actions = useNotesActions();
  
  const getAnnotations = useMemo(() => {
    return () => state.notes.filter(note => note.category === 'Anotação').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [state.notes]);

  return { ...state, ...actions, getAnnotations, loadNotes: actions.loadNotes };
};