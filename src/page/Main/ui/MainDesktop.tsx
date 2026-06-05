import desktopStyle from "../css/MainDesktop.module.css";
import "../../../style.css";
import mainImg from "../../../assets/main/main_img.svg";
// import mainImg from "../../../assets/main/main_img2.svg";
// import mainImg from "../../../assets/main/main_img3.svg";
import infoMapImg from "../../../assets/main/info_map.svg";
export default function MainDesktop() {
  return (
    <>
      <section className={desktopStyle.hero}>
        <img src={mainImg} alt="메인 이미지" />
        <div className={desktopStyle.heroText}>
          <div className={desktopStyle.heroTitle}>
            <span>여행 경험을</span>
            <span className={desktopStyle.gradientText}>다음 사람에게</span>
            <span>이어보세요</span>
          </div>
          <span className="trip-h3">AI가 설계하는 당신만의 릴레이 여행</span>
          <div className={desktopStyle.heroBtn}>
            <span className="trip-body2">릴레이 참여하기</span>
            {/* <span>아이콘</span> */}
          </div>
        </div>
      </section>

      <div className="container">
        <div className={desktopStyle.infoCard}>
          <div className={desktopStyle.infoText}>
            {/* 아이콘 */}
            <span>AI TRAVEL RELAY</span>
            <span className="trip-h1">여정은 계속 이어집니다</span>
            <div className={desktopStyle.subTitle}>
              <span className="trip-body1">
                누군가의 여정이 다음 사람의 여행이 됩니다.
              </span>
              <span className="trip-body1">
                지금, 전 세계 어딘가에서 릴레이가 이어지고 있어요.
              </span>
            </div>
            <div className={desktopStyle.infoBtn}>
              <span className="trip-body2">지도에서 보기</span>
              {/* <span>아이콘</span> */}
            </div>
          </div>
          <div className={desktopStyle.infoMap}>
            <img src={infoMapImg} alt="지도 이미지" />
          </div>
          <div className={desktopStyle.infoSummary}>
            <div>
              <div>
                {/* 아이콘 */}
                <div className={desktopStyle.infoSummaryItem}>
                  <span className="trip-body1">총 참여 인원</span>
                  <span className="trip-h1">1,234명</span>
                </div>
              </div>
            </div>
            <div>
              <div>
                {/* 아이콘 */}
                <div className={desktopStyle.infoSummaryItem}>
                  <span className="trip-body1">총 릴레이 수</span>
                  <span className="trip-h1">1,234개</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
