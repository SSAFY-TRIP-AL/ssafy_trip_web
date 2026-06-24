import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import "../style.css";
import BottomNav from "../components/BottomNav/BottomNav";
import logo from "../assets/logo_lf.svg";
import layoutStyle from "./MobileLayout.module.css";
// import { useAuthStore } from "../store/authStore";
// import { User as UserIcon } from "lucide-react";

export default function MobileLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hideTopBar = pathname.startsWith("/auth");
  // const { accessToken } = useAuthStore();
  // const goProfile = () => navigate(accessToken ? "/mypage" : "/auth/login");
  return (
    <div className={layoutStyle.mobileShell}>
      {!hideTopBar && (
        <header className={layoutStyle.topBar}>
          <img
            src={logo}
            alt="TRIP RELAY"
            className={layoutStyle.logo}
            onClick={() => navigate("/")}
          />
          {/* <button
            type="button"
            className={layoutStyle.heroAvatar}
            onClick={goProfile}
            aria-label="마이페이지로 이동"
          >
            <UserIcon size={20} color="#5A73FF" />
          </button> */}
        </header>
      )}
      <main className={layoutStyle.content}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
