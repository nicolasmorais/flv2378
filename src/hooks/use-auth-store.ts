
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const useAuthStoreInternal = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => {
        // also clear session storage on logout
        sessionStorage.removeItem('auth-storage');
        set({ isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);

interface AuthStore extends AuthState {
    isAuthLoaded: boolean;
}

// Custom hook to safely access the persisted state on the client
export const useAuthStore = (): AuthStore => {
  const [hydratedState, setHydratedState] = useState<AuthState & { isAuthLoaded: boolean }>({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    isAuthLoaded: false,
  });

  useEffect(() => {
    // This runs only on the client, after hydration
    const unsub = useAuthStoreInternal.subscribe(state => {
      setHydratedState({ ...state, isAuthLoaded: true });
    });

    // Set initial state
    const currentState = useAuthStoreInternal.getState();
    setHydratedState({ ...currentState, isAuthLoaded: true });

    return () => unsub();
  }, []);

  return hydratedState;
};
