import { useEffect, useState } from "react";
import { useConfirmStore } from "../../store/confirmStore";
import dialogStyle from "./ConfirmDialog.module.css";

const EXIT_MS = 180;

export default function ConfirmDialog() {
  const dialog = useConfirmStore((state) => state.dialog);
  const settle = useConfirmStore((state) => state.settle);
  const [isClosing, setIsClosing] = useState(false);

  const close = (value: boolean) => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      settle(value);
    }, EXIT_MS);
  };

  useEffect(() => {
    if (!dialog) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  if (!dialog) return null;

  const {
    title,
    message,
    confirmText = "확인",
    cancelText = "취소",
    tone = "default",
  } = dialog;

  return (
    <div
      className={`${dialogStyle.overlay} ${isClosing ? dialogStyle.overlayClosing : ""}`}
      onClick={() => close(false)}
    >
      <div
        className={`${dialogStyle.dialog} ${isClosing ? dialogStyle.dialogClosing : ""}`}
        onClick={(event) => event.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <span className={dialogStyle.title}>{title}</span>
        {message && <p className={dialogStyle.message}>{message}</p>}
        <div className={dialogStyle.actions}>
          <button
            type="button"
            className={dialogStyle.cancelBtn}
            onClick={() => close(false)}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`${dialogStyle.confirmBtn} ${
              tone === "danger" ? dialogStyle.confirmDanger : ""
            }`}
            onClick={() => close(true)}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
