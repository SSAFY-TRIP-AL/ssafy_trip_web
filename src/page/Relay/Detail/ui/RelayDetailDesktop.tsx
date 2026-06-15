import {
  ArrowRight,
  Calendar,
  ChevronRight,
  History,
  Sparkles,
  Users,
} from "lucide-react";
import "../../../../style.css";
import relayDetailStyle from "../css/RelayDetailDesktop.module.css";
import { useRelayDetail } from "../Hook/useRelayDetail";

export default function RelayDetailDesktop() {
  const { detail } = useRelayDetail();

  if (!detail) return <div className="container" />;

  return (
    <div className="container">
      <div className={relayDetailStyle.container}>
        <div className={relayDetailStyle.content}>
          <div className={relayDetailStyle.titleRow}>
            <span className="trip-h1">{detail.title}</span>
            <span className={relayDetailStyle.statusBadge}>
              {detail.status}
            </span>
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
                    <span className={relayDetailStyle.stopOrderBadge}>
                      {stop.order}
                    </span>
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
                      <span className={relayDetailStyle.stopTitle}>
                        {stop.location}
                      </span>
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
                    <ChevronRight
                      size={18}
                      className={relayDetailStyle.stopArrow}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={relayDetailStyle.subContent}>
          <button type="button" className={relayDetailStyle.joinBtn}>
            릴레이 참여하기
            <ArrowRight size={18} />
          </button>

          <div className={relayDetailStyle.aiRecommend}>
            <div className={relayDetailStyle.aiCardHeader}>
              <Sparkles size={18} />
              <span>AI 다음 지역 추천</span>
            </div>
            <img
              src={detail.recommendation.imageUrl}
              alt={detail.recommendation.title}
              className={relayDetailStyle.aiImage}
            />
            <div className={relayDetailStyle.aiTitleRow}>
              <span className={relayDetailStyle.aiTitle}>
                {detail.recommendation.title}
              </span>
              <div className={relayDetailStyle.aiTags}>
                {detail.recommendation.tags.map((tag) => (
                  <span key={tag} className={relayDetailStyle.aiTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className={relayDetailStyle.aiDescription}>
              {detail.recommendation.description}
            </p>
            {/* <button type="button" className={relayDetailStyle.aiSetBtn}>
              추천 지역으로 설정
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
