import { create } from "zustand";

export type ConfirmTone = "default" | "danger";

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
}

interface ConfirmStore {
  dialog: ConfirmOptions | null;
  resolver: ((value: boolean) => void) | null;
  open: (options: ConfirmOptions) => Promise<boolean>;
  settle: (value: boolean) => void;
}

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  dialog: null,
  resolver: null,
  open: (options) =>
    new Promise<boolean>((resolve) => {
      // 이미 열려있던 다이얼로그가 있다면 취소 처리
      get().resolver?.(false);
      set({ dialog: options, resolver: resolve });
    }),
  settle: (value) => {
    get().resolver?.(value);
    set({ dialog: null, resolver: null });
  },
}));

/**
 * React 외부/내부 어디서든 호출 가능한 확인 모달 헬퍼.
 * 예) const ok = await confirm({ title: "...", tone: "danger" });
 */
export const confirm = (options: ConfirmOptions) =>
  useConfirmStore.getState().open(options);
