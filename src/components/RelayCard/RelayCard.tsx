import { useNavigate } from "react-router-dom";
import cardStyle from "./RelayCard.module.css";

export type RelayCardVariant = "grid" | "row";

export interface RelayCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  categoryName?: string;
  variant?: RelayCardVariant;
}

export default function RelayCard({
  id,
  title,
  description,
  imageUrl,
  categoryName,
  variant = "grid",
}: RelayCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={variant === "grid" ? cardStyle.card : cardStyle.cardRow}
      onClick={() => navigate(`/relay/detail/${id}`)}
    >
      <div className={cardStyle.cardImageWrap}>
        <img src={imageUrl} alt={title} className={cardStyle.cardImage} />
        {categoryName && <span className={cardStyle.categoryBadge}>{categoryName}</span>}
      </div>
      <div className={cardStyle.cardBody}>
        <span className={cardStyle.cardTitle}>{title}</span>
        <p className={cardStyle.cardDescription}>{description}</p>
      </div>
    </div>
  );
}
