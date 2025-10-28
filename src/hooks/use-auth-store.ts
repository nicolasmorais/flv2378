
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isAuthLoaded: false,
  login: (password) => {
    const correctPassword = process.env.NEXT_PUBLIC_APP_PASSWORD || 'admin';
    if (password === correctPassword) {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false }),
}));

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const store = useAuthStore();
    useEffect(() => {
        // Simulate checking for a token or session
        // In a real app, this would be an API call
        setTimeout(() => {
            useAuthStore.setState({ isAuthLoaded: true });
        }, 1000);
    }, []);

    return <>{children}</>;
};
