import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  userName: string | null;

  login: (accessToken: string, userName: string) => void;

  logout: () => void;

  setAccessToken: (accessToken: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      userName: null,

      login: (accessToken, userName) =>
        set({
          accessToken,
          userName,
        }),

      logout: () =>
        set({
          accessToken: null,
          userName: null,
        }),
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
