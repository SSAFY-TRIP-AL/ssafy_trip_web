import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBookmark } from "../../Hook/useBookmark";
import cardStyle from "./RelayCard.module.css";

export type RelayCardVariant = "grid" | "row";

export interface RelayCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  categoryName?: string;
  variant?: RelayCardVariant;
  showBookmark?: boolean;
  initialBookmarked?: boolean;
}

export default function RelayCard({
  id,
  title,
  description,
  imageUrl,
  categoryName,
  variant = "grid",
  showBookmark = false,
  initialBookmarked = false,
}: RelayCardProps) {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmark(id, initialBookmarked);

  return (
    <div
      className={variant === "grid" ? cardStyle.card : cardStyle.cardRow}
      onClick={() => navigate(`/relay/detail/${id}`)}
    >
      <div className={cardStyle.cardImageWrap}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} className={cardStyle.cardImage} />
        ) : (
          <div className={cardStyle.cardImagePlaceholder} />
        )}
        {categoryName && <span className={cardStyle.categoryBadge}>{categoryName}</span>}
        {showBookmark && (
          <button
            type="button"
            className={cardStyle.bookmarkBtn}
            aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
            onClick={(event) => {
              event.stopPropagation();
              toggleBookmark();
            }}
          >
            <Heart
              size={18}
              fill={isBookmarked ? "#ef4444" : "none"}
              color={isBookmarked ? "#ef4444" : "#ffffff"}
            />
          </button>
        )}
      </div>
      <div className={cardStyle.cardBody}>
        <span className={cardStyle.cardTitle}>{title}</span>
        <p className={cardStyle.cardDescription}>{description}</p>
      </div>
    </div>
  );
}
