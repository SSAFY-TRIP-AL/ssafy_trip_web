import mobileStyle from "../css/MainMobile.module.css";
import "../../../style.css";
import mainImg from "../../../assets/main/main_img.png";
import infoMapImg from "../../../assets/main/info_map.svg";
import {
  ArrowRight,
  ChevronRight,
  Compass,
  Map,
  Users,
  Route,
  Globe,
  Trophy,
  Crown,
  Sparkles,
} from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { useMain } from "../Hook/useMain";
import RelayCard from "../../../components/RelayCard/RelayCard";
import { useCategories } from "../../../hooks/useCategories";
import { getCategoryStyle } from "../../../constants/categoryPalette";

export default function MainMobile() {
  const { mainInfo, goMap, goRelayList } = useMain();
  const { categories } = useCategories();

  const [first, second, third] = mainInfo.ranking;

  return (
    <>
      <section className={mobileStyle.hero}>
        <img src={mainImg} alt="메인 이미지" />
        <div className={mobileStyle.heroOverlay} />

        <div className={mobileStyle.heroText}>
          <div className={mobileStyle.heroBadge}>
            <Sparkles size={14} strokeWidth={2} />
            <span>AI 여행 릴레이</span>
          </div>
          <div className={mobileStyle.heroTitle}>
            <span>여행 경험을</span>
            <span className={mobileStyle.gradientText}>다음 사람에게</span>
            <span>이어보세요</span>
          </div>
          <span className="trip-body1">AI가 설계하는 당신만의 릴레이 여행</span>
          <div className={mobileStyle.heroBtnRow}>
            <div className={mobileStyle.heroBtn} onClick={goMap}>
              <span className="trip-body1">릴레이 참여하기</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </div>
            <div className={mobileStyle.heroBtnOutline} onClick={goRelayList}>
              <span className="trip-body1">릴레이 둘러보기</span>
            </div>
          </div>
          <span className={mobileStyle.memberCount}>
            현재 {mainInfo.userCount}명이 함께하고 있어요
          </span>
        </div>
      </section>

      <div className={mobileStyle.container}>
        <div className={mobileStyle.infoCard}>
          <div className={mobileStyle.infoLabel}>
            <Compass size={16} strokeWidth={2} />
            <span>AI TRAVEL RELAY</span>
          </div>
          <span className="trip-h2">여정은 계속 이어집니다</span>
          <div className={mobileStyle.subTitle}>
            <span className="trip-body2">누군가의 여정이 다음 사람의 여행이 됩니다.</span>
            <span className="trip-body2">지금, 전 세계 어딘가에서 릴레이가 이어지고 있어요.</span>
          </div>
          <div className={mobileStyle.infoMap}>
            <img src={infoMapImg} alt="지도 이미지" />
          </div>
          <div className={mobileStyle.infoBtn} onClick={goMap}>
            <Map size={16} strokeWidth={1.75} />
            <span className="trip-body1">지도에서 보기</span>
          </div>
        </div>

        <div className={mobileStyle.relayContainer}>
          <div className={mobileStyle.relayTitle}>
            <span className="trip-h3">
              <Globe size={20} strokeWidth={1.5} className={mobileStyle.sectionIcon} />
              현재 진행 중인 릴레이
            </span>
            <span onClick={goRelayList} className={`trip-body2 ${mobileStyle.relayViewAll}`}>
              전체 보기
              <ChevronRight size={14} strokeWidth={2} />
            </span>
          </div>
          {mainInfo.relays.relays.length === 0 ? (
            <div className={mobileStyle.emptyState}>
              아직 진행 중인 릴레이가 없어요.
            </div>
          ) : (
            <div className={mobileStyle.relayScroll}>
              {mainInfo.relays.relays.map((relay) => (
                <div key={relay.id} className={mobileStyle.relayScrollItem}>
                  <RelayCard
                    id={relay.id}
                    title={relay.title}
                    description={`${relay.participantCount}명 참여중`}
                    imageUrl={relay.photoUrl}
                    categoryName={relay.category}
                    categoryStyle={getCategoryStyle(
                      categories.findIndex((c) => c.name === relay.category),
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={mobileStyle.statsRow}>
          <div className={mobileStyle.statCard}>
            <div className={mobileStyle.statIcon}>
              <Users size={18} strokeWidth={1.75} />
            </div>
            <span className="trip-body2">총 참여 인원</span>
            <span className="trip-h3">{mainInfo.userCount}명</span>
          </div>
          <div className={mobileStyle.statCard}>
            <div className={mobileStyle.statIcon}>
              <Route size={18} strokeWidth={1.75} />
            </div>
            <span className="trip-body2">총 릴레이 수</span>
            <span className="trip-h3">{mainInfo.relayCount}개</span>
          </div>
        </div>

        <div className={mobileStyle.rankingContainer}>
          <div className={mobileStyle.rankingTitle}>
            <span className="trip-h3">
              <Trophy size={20} strokeWidth={1.5} className={mobileStyle.sectionIcon} />
              명예의 전당
            </span>
            <span className="trip-body2">
              릴레이를 가장 활발하게 이어가고 있는 Top3 유저입니다.
            </span>
          </div>
          {mainInfo.ranking.length === 0 ? (
            <div className={mobileStyle.emptyState}>
              아직 랭킹에 오른 유저가 없어요.
            </div>
          ) : (
          <div className={mobileStyle.rankingList}>
            {first && (
              <div className={`${mobileStyle.rankingItem} ${mobileStyle.rankingFirst}`}>
                <Crown size={26} strokeWidth={1.5} className={mobileStyle.trophyIcon} />
                <div
                  className={mobileStyle.profileImg}
                  style={{
                    backgroundImage: `url(${first.profileImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <span className="trip-h3">{first.name}</span>
                <span className="trip-body2">릴레이 {first.participationCount}회 참여</span>
              </div>
            )}
            {second && (
              <div className={`${mobileStyle.rankingItem} ${mobileStyle.rankingSecond}`}>
                <div className={mobileStyle.rankBadge}>2</div>
                <div
                  className={mobileStyle.profileImg}
                  style={{
                    backgroundImage: `url(${second.profileImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <span className="trip-body1">{second.name}</span>
                <span className="trip-body2">릴레이 {second.participationCount}회 참여</span>
              </div>
            )}
            {third && (
              <div className={`${mobileStyle.rankingItem} ${mobileStyle.rankingThird}`}>
                <div className={mobileStyle.rankBadge}>3</div>
                <div
                  className={mobileStyle.profileImg}
                  style={{
                    backgroundImage: `url(${third.profileImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <span className="trip-body1">{third.name}</span>
                <span className="trip-body2">릴레이 {third.participationCount}회 참여</span>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </>
  );
}
