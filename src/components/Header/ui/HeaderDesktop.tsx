import logo from "../../../assets/logo_lf.svg";
import headerStyle from "../css/header.module.css";
import "../../../style.css";
import { useNavigate } from "react-router-dom";

export default function HeaderDesktop() {
  const navigate = useNavigate();
  function goHome() {
    navigate("/");
  }
  return (
    <header className={headerStyle.headerContainer}>
      <div className={headerStyle.headerContent}>
        <div className={headerStyle.logoContainer}>
          <img
            src={logo}
            alt="Logo"
            className={headerStyle.logo}
            onClick={goHome}
          />
        </div>
        <ul>
          <li>
            <a href="/">홈</a>
          </li>
          <li>
            <a href="/">지도</a>
          </li>
          <li>
            <a href="/">릴레이 리스트</a>
          </li>
          <li>
            <a href="/">릴레이 등록</a>
          </li>
        </ul>
        <div className={headerStyle.myPage}>
          <div className={headerStyle.profileImg}></div>
          <span>김싸피</span>
        </div>
      </div>
    </header>
  );
}
