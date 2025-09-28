'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Note } from '@/lib/types';
import { encrypt, decrypt } from '@/lib/crypto';
import { initialNotes } from '@/lib/initial-data';

type StoredNote = Omit<Note, 'content'> & { content: string }; // content is encrypted

const STORAGE_KEY = 'copinote-notes';

export const useNotesStore = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        const storedNotes: StoredNote[] = JSON.parse(item);
        const decryptedNotes: Note[] = storedNotes.map(note => ({
          ...note,
          content: decrypt(note.content),
        }));
        setNotes(decryptedNotes);
      } else {
        // If no data in localStorage, initialize with initialNotes
        setNotes(initialNotes);
        persistNotes(initialNotes);
      }
    } catch (e) {
      console.error("Failed to load or parse notes from localStorage:", e);
      window.localStorage.removeItem(STORAGE_KEY);
       // Fallback to initial data if localStorage is corrupt
       setNotes(initialNotes);
       persistNotes(initialNotes);
    }
    setIsLoaded(true);
  }, []);

  const persistNotes = useCallback((notesToPersist: Note[]) => {
    try {
      const encryptedNotes: StoredNote[] = notesToPersist.map(note => ({
        ...note,
        content: encrypt(note.content),
      }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(encryptedNotes));
    } catch (e) {
      console.error("Failed to persist notes to localStorage:", e);
    }
  }, []);

  const addNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setNotes(prevNotes => {
      const updatedNotes = [...prevNotes, newNote];
      persistNotes(updatedNotes);
      return updatedNotes;
    });
  }, [persistNotes]);

  const updateNote = useCallback((id: string, updatedData: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.map(note => 
        note.id === id ? { ...note, ...updatedData } : note
      );
      persistNotes(updatedNotes);
      return updatedNotes;
    });
  }, [persistNotes]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.filter(note => note.id !== id);
      persistNotes(updatedNotes);
      return updatedNotes;
    });
  }, [persistNotes]);

  return { notes, addNote, updateNote, deleteNote, isLoaded };
};
