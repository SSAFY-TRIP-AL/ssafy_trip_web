import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  userName: string | null;
  profileImage: string | undefined;

  login: (accessToken: string, userName: string, profileImage: string) => void;
  logout: () => void;
  setAccessToken: (accessToken: string) => void;
  isLogin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      userName: null,
      profileImage: undefined,

      login: (accessToken, userName, profileImage) =>
        set({
          accessToken,
          userName,
          profileImage,
        }),

      logout: () =>
        set({
          accessToken: null,
          userName: null,
          profileImage: undefined,
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
