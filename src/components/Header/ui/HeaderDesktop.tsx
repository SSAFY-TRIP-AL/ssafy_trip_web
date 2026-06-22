import logo from "../../../assets/logo_lf.svg";
import headerStyle from "../css/header.module.css";
import "../../../style.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

export default function HeaderDesktop() {
  const navigate = useNavigate();
  const userName = useAuthStore((state) => state.userName);
  const profileImage = useAuthStore((state) => state.profileImage);
  function goHome() {
    navigate("/");
  }
  const accessToken = useAuthStore((state) => state.accessToken);

  const isLogin = !!accessToken;
  return (
    <header className={headerStyle.headerContainer}>
      <div className={headerStyle.headerContent}>
        <div className={headerStyle.logoContainer}>
          <img src={logo} alt="Logo" className={headerStyle.logo} onClick={goHome} />
        </div>
        <ul>
          <li>
            <a href="/">홈</a>
          </li>
          <li>
            <a href="/map">지도</a>
          </li>
          <li>
            <a href="/relay/list">릴레이 리스트</a>
          </li>
          <li>
            <a href="/relay/register">릴레이 등록</a>
          </li>
        </ul>
        <div className={headerStyle.myPage}>
          {isLogin ? (
            <>
              <img
                className={headerStyle.profileImg}
                src={profileImage}
                onClick={() => navigate("/mypage")}
              />
              <span onClick={() => navigate("/mypage")}>{userName}</span>
            </>
          ) : (
            <span
              className={`trip-body1 ${headerStyle.loginBtn}`}
              onClick={() => navigate("/auth/login")}
            >
              로그인
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
