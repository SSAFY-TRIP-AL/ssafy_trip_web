import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRelayDetail, type RelayDetailData } from "../api/relayDetailApi";
import {
  getRecommendations,
  type Recommendation,
} from "../../../../api/aiApi";

export const useRelayDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<RelayDetailData | null>(null);

  const [preference, setPreference] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isRecommendLoading, setIsRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState("");

  useEffect(() => {
    let active = true;

    getRelayDetail(Number(id)).then((data) => {
      if (active) setDetail(data);
    });

    return () => {
      active = false;
    };
  }, [id]);

  const fetchRecommendations = async () => {
    if (!detail) return;

    setIsRecommendLoading(true);
    setRecommendError("");
    try {
      const response = await getRecommendations({
        relayId: detail.id,
        currentLocation: detail.previousStops.at(-1)?.location ?? "",
        category: detail.category,
        preference,
      });
      setRecommendations(response.recommendations);
    } catch {
      setRecommendError("추천을 받아오지 못했습니다. 다시 시도해주세요.");
    } finally {
      setIsRecommendLoading(false);
    }
  };

  return {
    detail,
    preference,
    setPreference,
    recommendations,
    isRecommendLoading,
    recommendError,
    fetchRecommendations,
  };
};
