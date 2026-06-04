import style from "../css/MainDesktop.module.css";
import mainImg from "../../../assets/main/main_img.svg";
// import mainImg from "../../../assets/main/main_img2.svg";
// import mainImg from "../../../assets/main/main_img3.svg";
export default function MainDesktop() {
  return (
    <>
      <section className={style.hero}>
        <img src={mainImg} alt="메인 이미지" />
        <div className={style.heroText}>
          <div className={style.heroTitle}>
            <span>여행 경험을</span>
            <span className={style.gradientText}>다음 사람에게</span>
            <span>이어보세요</span>
          </div>
          <span>AI가 설계하는 당신만의 릴레이 여행</span>
          <div className={style.heroBtn}>
            <span>릴레이 참여하기</span> <span>{">"}</span>
          </div>
        </div>
      </section>

      <div className={style.content}>{/* 아래 카드들 */}</div>
    </>
  );
}
