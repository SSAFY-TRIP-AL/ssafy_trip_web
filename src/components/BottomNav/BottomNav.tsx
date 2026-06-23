import { Home, MapPin, ListChecks, PlusSquare, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import navStyle from "./BottomNav.module.css";

export default function BottomNav() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = !!accessToken;

  const navItems = [
    { to: "/", label: "홈", icon: Home, end: true },
    { to: "/map", label: "지도", icon: MapPin, end: false },
    { to: "/relay/list", label: "릴레이 리스트", icon: ListChecks, end: false },
    { to: "/relay/register", label: "릴레이 등록", icon: PlusSquare, end: false },
    {
      to: isLogin ? "/mypage" : "/auth/login",
      label: isLogin ? "마이페이지" : "로그인",
      icon: User,
      end: false,
    },
  ];

  return (
    <nav className={navStyle.bottomNav}>
      {navItems.map((item) => (
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
