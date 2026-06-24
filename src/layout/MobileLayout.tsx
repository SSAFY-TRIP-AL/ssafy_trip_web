import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import "../style.css";
import BottomNav from "../components/BottomNav/BottomNav";
import logo from "../assets/logo_lf.svg";
import layoutStyle from "./MobileLayout.module.css";

export default function MobileLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hideTopBar = pathname.startsWith("/auth");

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
        </header>
      )}
      <main className={layoutStyle.content}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
