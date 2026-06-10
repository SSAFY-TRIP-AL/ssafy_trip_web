import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  userName: string | null;

  login: (accessToken: string, userName: string) => void;
  logout: () => void;
  setAccessToken: (accessToken: string) => void;
  isLogin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
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

      setAccessToken: (accessToken) =>
        set({
          accessToken,
        }),

      isLogin: () => get().accessToken !== null,
    }),
    {
      name: "auth-storage",
    },
  ),
);
