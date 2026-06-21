import api from "./api";

interface Recommendation {
  locationName: string;
  reason: string;
}

interface RecommendationsResponse {
  recommendations: Recommendation[];
}
interface RecommendationsRequest {
  relayId: number;
  currentLocation: string;
  category: string;
  preference: string;
}

export const getRecommendations = async (
  request: RecommendationsRequest,
): Promise<RecommendationsResponse> => {
  try {
    const response = await api.post<RecommendationsResponse>(
      "/recommend",
      request,
    );

    return response.data;
  } catch (error) {
    console.error("추천 지역 조회 실패", error);
    throw error;
  }
};
