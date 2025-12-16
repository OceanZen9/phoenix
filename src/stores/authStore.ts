import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "@/types/user";
import { login as loginService, register as registerService } from "@/services/auth";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  logout: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
        // Side-effect: You might want to clear axios headers here too
      },
      login: async (payload) => {
        const response = await loginService(payload);
        set({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        // Side-effect: You might want to set axios headers here
      },
      register: async (payload) => {
        await registerService(payload);
        // Register does not log the user in
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export const useAuth = useAuthStore;

// Add a selector for isAuthenticated for convenience
export const useIsAuthenticated = () => useAuth((state) => !!state.accessToken);
