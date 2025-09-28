
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
  login: () => void;
  logout: () => void;
  _setAuthLoaded: (isLoaded: boolean) => void;
}

const useAuthStoreInternal = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAuthLoaded: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
      _setAuthLoaded: (isLoaded: boolean) => set({ isAuthLoaded: isLoaded }),
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);

export const useAuthStore = () => {
    const state = useAuthStoreInternal();
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        // This effect ensures that we check the persisted state only on the client
        // and set the isAuthLoaded flag correctly.
        const unsubscribe = useAuthStoreInternal.persist.onFinishHydration(() => {
            state._setAuthLoaded(true);
            setHasHydrated(true);
        });

        // If hydration is already done, set loaded state
        if (useAuthStoreInternal.persist.hasHydrated()) {
            state._setAuthLoaded(true);
            setHasHydrated(true);
        }
        
        return () => {
            unsubscribe();
        };

    }, []);

    // Return the state but ensure isAuthLoaded is reflective of hydration status
    return { ...state, isAuthLoaded: hasHydrated };
};
