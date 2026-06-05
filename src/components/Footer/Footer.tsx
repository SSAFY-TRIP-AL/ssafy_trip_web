import footerStyle from "./Footer.module.css";
import logo from "../../assets/logo_lf.svg";

export default function Footer() {
  return (
    <footer className={footerStyle.footer}>
      <div className={footerStyle.inner}>
        <div className={footerStyle.top}>
          <div className={footerStyle.brand}>
            <img src={logo} alt="TRIP RELAY" className={footerStyle.logo} />
            <p className={footerStyle.brandDesc}>
              누군가의 여정이 다음 사람의 여행이 됩니다.
              <br />
              AI가 설계하는 릴레이 여행 플랫폼.
            </p>
          </div>

          <div className={footerStyle.navArea}>
            <nav className={footerStyle.navGroup}>
              <span className={footerStyle.navTitle}>서비스</span>
              <ul className={footerStyle.navList}>
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
                <li>
                  <a href="/">명예의 전당</a>
                </li>
              </ul>
            </nav>

            <nav className={footerStyle.navGroup}>
              <span className={footerStyle.navTitle}>안내</span>
              <ul className={footerStyle.navList}>
                <li>
                  <a href="/">서비스 소개</a>
                </li>
                <li>
                  <a href="/">이용 방법</a>
                </li>
                <li>
                  <a href="/">공지사항</a>
                </li>
                <li>
                  <a href="/">자주 묻는 질문</a>
                </li>
              </ul>
            </nav>

            <nav className={footerStyle.navGroup}>
              <span className={footerStyle.navTitle}>고객지원</span>
              <ul className={footerStyle.navList}>
                <li>
                  <a href="/">문의하기</a>
                </li>
                <li>
                  <a href="/">버그 제보</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className={footerStyle.divider} />

        <div className={footerStyle.bottom}>
          <span className={footerStyle.copyright}>
            © 2026 SSAFY TRIP. All rights reserved.
          </span>
          <div className={footerStyle.legal}>
            <a href="/">이용약관</a>
            <a href="/">개인정보처리방침</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
