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

/** JWT 만료 체크 */
const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

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

      logout: () => {
        set({
          accessToken: null,
          userName: null,
          profileImage: undefined,
        });

        // persist storage 초기화
        useAuthStore.persist.clearStorage();
      },

      setAccessToken: (accessToken) =>
        set({
          accessToken,
        }),

      isLogin: () => {
        const token = get().accessToken;
        if (!token) return false;

        return !isTokenExpired(token);
      },
    }),
    {
      name: "auth-storage",

      /**
       * 앱 새로 로드될 때 localStorage 복원 직후 실행
       * → 만료된 토큰 자동 삭제
       */
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        if (state.accessToken && isTokenExpired(state.accessToken)) {
          state.logout();
        }
      },
    },
  ),
);
