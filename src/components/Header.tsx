import logo from "../assets/logo_lf.svg";
import style from "../css/components/header.module.css";

export default function Header() {
  return (
    <div className={style.headerContainer}>
      <div className={style.headerContent}>
        <img src={logo} alt="Logo" className={style.logo} />
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
        <div className={style.myPage}>
          <div className={style.profileImg}></div>
          <span>김싸피</span>
        </div>
      </div>
    </div>
  );
}
