
'use client';

import { create } from 'zustand';
import type { Access } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { fetchAccesses, addAccessAction, updateAccessAction, deleteAccessAction } from '@/app/actions';

interface AccessesStoreState {
  accesses: Access[];
  isLoaded: boolean;
  addAccess: (access: Omit<Access, 'id' | 'createdAt'>) => Promise<void>;
  updateAccess: (id: string, access: Partial<Omit<Access, 'id' | 'createdAt'>>) => Promise<void>;
  deleteAccess: (id: string) => Promise<void>;
  loadAccesses: () => Promise<void>;
}

const useAccessStoreInternal = create<AccessesStoreState>((set, get) => ({
  accesses: [],
  isLoaded: false,
  loadAccesses: async () => {
    try {
      set({ isLoaded: false }); 
      const accesses = await fetchAccesses();
      const sortedAccesses = accesses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      set({ accesses: sortedAccesses, isLoaded: true });
    } catch (error) {
      console.error("Failed to load accesses:", error);
      set({ isLoaded: true });
    }
  },
  addAccess: async (access) => {
    await addAccessAction(access);
    await get().loadAccesses();
  },
  updateAccess: async (id, access) => {
    await updateAccessAction(id, access);
    await get().loadAccesses();
  },
  deleteAccess: async (id) => {
    await deleteAccessAction(id);
    await get().loadAccesses();
  },
}));

export const useAccessState = () => {
  return useAccessStoreInternal((state) => ({
    accesses: state.accesses,
    isLoaded: state.isLoaded,
  }));
};

export const useAccessActions = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const actions = useAccessStoreInternal((state) => ({
    loadAccesses: state.loadAccesses,
    addAccess: state.addAccess,
    updateAccess: state.updateAccess,
    deleteAccess: state.deleteAccess,
  }));

  useEffect(() => {
    if (!isInitialized) {
      actions.loadAccesses();
      setIsInitialized(true);
    }
  }, [actions, isInitialized]);

  return actions;
};

export const useAccessStore = () => {
  const state = useAccessState();
  const actions = useAccessActions();
  
  return { ...state, ...actions };
};

    