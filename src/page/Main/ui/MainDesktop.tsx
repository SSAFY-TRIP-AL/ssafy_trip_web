import desktopStyle from "../css/MainDesktop.module.css";
import "../../../style.css";
import mainImg from "../../../assets/main/main_img3.svg";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/api";

interface RelaySummary {
  id: number;
  title: string;
  category: string;
  participantCount: number;
}

interface OngoingRelay extends RelaySummary {
  lastParticipatedAt: string;
}

interface RankingUser {
  id: number;
  name: string;
  profileImage: string;
  participationCount: number;
}

interface MainInfo {
  userCount: number;
  relayCount: number;
  relays: {
    relays: OngoingRelay[];
  };
  ranking: RankingUser[];
}
export default function MainDesktop() {
  const [mainInfo, setMainInfo] = useState<MainInfo>({
    userCount: 0,
    relayCount: 0,
    relays: { relays: [] },
    ranking: [],
  });
  const fetchMainInfo = async () => {
    try {
      const response = await api.get<MainInfo>("/main");
      setMainInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMainInfo();
  }, []);

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
            <span className="trip-body1">릴레이 참여하기</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </div>
          <span className={desktopStyle.memberCount}>
            현재 {mainInfo.userCount}명이 함께하고 있어요
          </span>
        </div>
      </section>

      <div className="container">
        <div className={desktopStyle.infoCard}>
          <div className={desktopStyle.infoText}>
            <div className={desktopStyle.infoLabel}>
              <Compass size={16} strokeWidth={2} />
              <span>AI TRAVEL RELAY</span>
            </div>
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
              <Map size={16} strokeWidth={1.75} />
              <span className="trip-body1">지도에서 보기</span>
            </div>
          </div>
          <div className={desktopStyle.infoMap}>
            <img src={infoMapImg} alt="지도 이미지" />
          </div>
          <div className={desktopStyle.infoSummary}>
            <div className={desktopStyle.infoSummaryItem}>
              <Users
                size={20}
                strokeWidth={1.75}
                className={desktopStyle.summaryIcon}
              />
              <span className="trip-body1">총 참여 인원</span>
              <span className="trip-h1">{mainInfo.userCount}명</span>
            </div>
            <div className={desktopStyle.infoSummaryItem}>
              <Route
                size={20}
                strokeWidth={1.75}
                className={desktopStyle.summaryIcon}
              />
              <span className="trip-body1">총 릴레이 수</span>
              <span className="trip-h1">{mainInfo.relayCount}개</span>
            </div>
          </div>
        </div>

        <div className={desktopStyle.relayContainer}>
          <div className={desktopStyle.relayTitle}>
            <span className="trip-h1">
              <Globe
                size={28}
                strokeWidth={1.5}
                className={desktopStyle.sectionIcon}
              />
              현재 진행 중인 릴레이
            </span>
            <span className={`trip-body1 ${desktopStyle.relayViewAll}`}>
              전체 보기
              <ChevronRight size={16} strokeWidth={2} />
            </span>
          </div>
          <div className={desktopStyle.relayList}>
            {mainInfo.relays.relays.map((relay) => (
              <div className={desktopStyle.relayCard} key={relay.id}>
                <div className={desktopStyle.relayImg}></div>
                <div className={desktopStyle.relayInfo}>
                  <span className="trip-h3">{relay.title}</span>
                  <span className="trip-body1">
                    {relay.participantCount}명 참여중
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={desktopStyle.rankingContainer}>
          <div className={desktopStyle.rankingTitle}>
            <span className="trip-h1">
              <Trophy
                size={28}
                strokeWidth={1.5}
                className={desktopStyle.sectionIcon}
              />
              명예의 전당
            </span>
            <span className="trip-body1">
              릴레이를 가장 활발하게 이어가고 있는 Top3 유저입니다.
            </span>
          </div>
          <div className={desktopStyle.rankingList}>
            {(() => {
              const [first, second, third] = mainInfo.ranking;
              return (
                <>
                  {second && (
                    <div
                      className={`${desktopStyle.rankingItem} ${desktopStyle.rankingSecond}`}
                    >
                      <div className={desktopStyle.rankBadge}>2</div>
                      <div
                        className={desktopStyle.profileImg}
                        style={{
                          backgroundImage: `url(${second.profileImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <span className="trip-h3">{second.name}</span>
                      <span className="trip-body1">
                        릴레이 {second.participationCount}회 참여
                      </span>
                    </div>
                  )}
                  {first && (
                    <div
                      className={`${desktopStyle.rankingItem} ${desktopStyle.rankingFirst}`}
                    >
                      <Crown
                        size={32}
                        strokeWidth={1.5}
                        className={desktopStyle.trophyIcon}
                      />
                      <div
                        className={desktopStyle.profileImg}
                        style={{
                          backgroundImage: `url(${first.profileImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <span className="trip-h3">{first.name}</span>
                      <span className="trip-body1">
                        릴레이 {first.participationCount}회 참여
                      </span>
                    </div>
                  )}
                  {third && (
                    <div
                      className={`${desktopStyle.rankingItem} ${desktopStyle.rankingThird}`}
                    >
                      <div className={desktopStyle.rankBadge}>3</div>
                      <div
                        className={desktopStyle.profileImg}
                        style={{
                          backgroundImage: `url(${third.profileImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <span className="trip-h3">{third.name}</span>
                      <span className="trip-body1">
                        릴레이 {third.participationCount}회 참여
                      </span>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </>
  );
}
