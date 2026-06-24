import api from "./api";

export interface AiSummary {
  locationName: string;
  summary: string;
  highlights: string[];
}

export const getAiSummary = async (locationName: string, category?: string): Promise<AiSummary> => {
  const response = await api.get<AiSummary>("/ai/summary", {
    params: {
      locationName: locationName,
      category: category || undefined,
    },
  });

  return response.data;
};

export interface Recommendation {
  locationName: string;
  reason: string;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
}
export interface RecommendationsRequest {
  relayId: number;
  currentLocation: string;
  category: string;
  preference: string;
}

export const getRecommendations = async (
  request: RecommendationsRequest,
): Promise<RecommendationsResponse> => {
  try {
    const response = await api.post<RecommendationsResponse>("/ai/recommend", request);

    return response.data;
  } catch (error) {
    console.error("추천 지역 조회 실패", error);
    throw error;
  }
};
