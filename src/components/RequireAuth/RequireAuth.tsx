import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { toast } from "../../store/toastStore";

export default function RequireAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const location = useLocation();

  useEffect(() => {
    if (!accessToken) {
      toast.warning("로그인이 필요한 페이지입니다.");
    }
  }, [accessToken]);

  if (!accessToken) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
