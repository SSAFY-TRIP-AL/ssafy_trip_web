import { isMobile } from "react-device-detect";
import { useToastStore } from "../../store/toastStore";
import ToastItem from "./ToastItem";
import desktopStyles from "./DesktopToast.module.css";
import mobileStyles from "./MobileToast.module.css";

export default function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  const platform = isMobile ? "mobile" : "desktop";
  const styles = isMobile ? mobileStyles : desktopStyles;

  if (toasts.length === 0) return null;

  return (
    <div className={styles.viewport}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          platform={platform}
          styles={styles}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}
