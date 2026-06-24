import { Home, MapPin, ListChecks, Plus, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import navStyle from "./BottomNav.module.css";

export default function BottomNav() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = !!accessToken;

  const sideItems = [
    { to: "/", label: "홈", icon: Home, end: true },
    { to: "/map", label: "지도", icon: MapPin, end: false },
    { to: "/relay/list", label: "릴레이", icon: ListChecks, end: false },
    {
      to: isLogin ? "/mypage" : "/auth/login",
      label: isLogin ? "마이페이지" : "로그인",
      icon: User,
      end: false,
    },
  ];

  return (
    <nav className={navStyle.bottomNav}>
      {sideItems.slice(0, 2).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            isActive ? `${navStyle.navItem} ${navStyle.navItemActive}` : navStyle.navItem
          }
        >
          <item.icon size={20} />
          <span className={navStyle.navLabel}>{item.label}</span>
        </NavLink>
      ))}

      <div className={navStyle.centerSlot}>
        <NavLink
          to="/relay/register"
          className={({ isActive }) =>
            isActive
              ? `${navStyle.centerBtn} ${navStyle.centerBtnActive}`
              : navStyle.centerBtn
          }
        >
          <Plus size={26} strokeWidth={2.5} />
        </NavLink>
        <span className={navStyle.centerLabel}>등록하기</span>
      </div>

      {sideItems.slice(2).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            isActive ? `${navStyle.navItem} ${navStyle.navItemActive}` : navStyle.navItem
          }
        >
          <item.icon size={20} />
          <span className={navStyle.navLabel}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
