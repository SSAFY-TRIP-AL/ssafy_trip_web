import { ArrowRight, Calendar, ChevronRight, Heart, History, Sparkles, Users } from "lucide-react";
import "../../../../style.css";
import relayDetailStyle from "../css/RelayDetailDesktop.module.css";
import { useRelayDetail } from "../Hook/useRelayDetail";
import { useBookmark } from "../../../../Hook/useBookmark";

export default function RelayDetailDesktop() {
  const {
    detail,
    preference,
    setPreference,
    recommendations,
    isRecommendLoading,
    recommendError,
    fetchRecommendations,
    goAddRelayStep,
  } = useRelayDetail();
  const { isBookmarked, toggleBookmark } = useBookmark(
    detail?.id ?? 0,
    detail?.bookmarked ?? false,
  );

  if (!detail) return <div className="container" />;

  return (
    <div className="container">
      <div className={relayDetailStyle.container}>
        <div className={relayDetailStyle.content}>
          <div className={relayDetailStyle.titleRow}>
            <span className="trip-h1">{detail.title}</span>
            <span className={relayDetailStyle.statusBadge}>{detail.category}</span>
            <button
              type="button"
              className={relayDetailStyle.bookmarkBtn}
              aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
              onClick={toggleBookmark}
            >
              <Heart
                size={24}
                fill={isBookmarked ? "#ef4444" : "none"}
                color={isBookmarked ? "#ef4444" : "var(--color-gray-300)"}
              />
            </button>
          </div>

          <div className={relayDetailStyle.metaRow}>
            <span className={relayDetailStyle.metaItem}>
              <Users size={16} />
              참여자 {detail.participantCount}명
            </span>
          </div>

          <div className={relayDetailStyle.heroImageWrap}>
            <img
              src={detail.coverImageUrl}
              alt={detail.title}
              className={relayDetailStyle.heroImage}
            />
          </div>

          <div className={relayDetailStyle.previousSection}>
            <div className={relayDetailStyle.sectionTitle}>
              <History size={20} />
              <span className="trip-h3">이전 지역</span>
            </div>

            <div className={relayDetailStyle.stopList}>
              {detail.previousStops.map((stop, index) => (
                <div key={stop.id} className={relayDetailStyle.stopItem}>
                  <div className={relayDetailStyle.stopOrderColumn}>
                    <span className={relayDetailStyle.stopOrderBadge}>{stop.order}</span>
                    {index < detail.previousStops.length - 1 && (
                      <span className={relayDetailStyle.stopLine} />
                    )}
                  </div>
                  <div className={relayDetailStyle.stopCard}>
                    <img
                      src={stop.imageUrl}
                      alt={stop.location}
                      className={relayDetailStyle.stopImage}
                    />
                    <div className={relayDetailStyle.stopInfo}>
                      <span className={relayDetailStyle.stopTitle}>{stop.location}</span>
                      <div className={relayDetailStyle.stopMeta}>
                        <span className={relayDetailStyle.stopMetaItem}>
                          <Calendar size={14} />
                          {stop.period}
                        </span>
                        <span className={relayDetailStyle.stopMetaItem}>
                          <Users size={14} />
                          참여자 {stop.participantCount}명
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className={relayDetailStyle.stopArrow} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={relayDetailStyle.subContent}>
          <button type="button" className={relayDetailStyle.joinBtn} onClick={goAddRelayStep}>
            릴레이 참여하기
            <ArrowRight size={18} />
          </button>

          <div className={relayDetailStyle.aiRecommend}>
            <div className={relayDetailStyle.aiCardHeader}>
              <Sparkles size={18} />
              <span>AI 다음 지역 추천</span>
            </div>

            <textarea
              className={relayDetailStyle.aiPreferenceInput}
              placeholder="원하는 여행 스타일이나 선호사항을 입력해주세요. (예: 한적한 바다, 미식 여행)"
              value={preference}
              onChange={(event) => setPreference(event.target.value)}
            />
            <button
              type="button"
              className={relayDetailStyle.aiRecommendBtn}
              onClick={fetchRecommendations}
              disabled={isRecommendLoading}
            >
              {isRecommendLoading ? "추천 받는 중..." : "AI 추천 받기"}
            </button>

            {recommendError && <p className={relayDetailStyle.aiError}>{recommendError}</p>}

            {recommendations.length > 0 && (
              <div className={relayDetailStyle.aiResultList}>
                {recommendations.map((item, index) => (
                  <div
                    key={`${item.locationName}-${index}`}
                    className={relayDetailStyle.aiResultItem}
                  >
                    <span className={relayDetailStyle.aiResultLocation}>{item.locationName}</span>
                    <p className={relayDetailStyle.aiResultReason}>{item.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
