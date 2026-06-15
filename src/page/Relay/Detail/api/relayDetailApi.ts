export type RelayDetailStatus = "진행중" | "대기중";

export interface RelayPreviousStop {
  id: number;
  order: number;
  location: string;
  imageUrl: string;
  period: string;
  participantCount: number;
}

export interface RelayRecommendation {
  imageUrl: string;
  title: string;
  tags: string[];
  description: string;
}

export interface RelayDetailData {
  id: number;
  title: string;
  status: RelayDetailStatus;
  participantCount: number;
  coverImageUrl: string;
  previousStops: RelayPreviousStop[];
  recommendation: RelayRecommendation;
}

const MOCK_RELAY_DETAIL: RelayDetailData = {
  id: 1,
  title: "그리스 산토리니 7일",
  status: "진행중",
  participantCount: 128,
  coverImageUrl: "https://picsum.photos/seed/santorini/1200/450",
  previousStops: [
    {
      id: 1,
      order: 1,
      location: "스페인 바르셀로나",
      imageUrl: "https://picsum.photos/seed/barcelona/200/160",
      period: "2024.05.10 ~ 2024.05.16 (7일)",
      participantCount: 156,
    },
    {
      id: 2,
      order: 2,
      location: "프랑스 니스",
      imageUrl: "https://picsum.photos/seed/nice/200/160",
      period: "2024.05.03 ~ 2024.05.09 (7일)",
      participantCount: 142,
    },
    {
      id: 3,
      order: 3,
      location: "이탈리아 피렌체",
      imageUrl: "https://picsum.photos/seed/florence/200/160",
      period: "2024.04.26 ~ 2024.05.02 (7일)",
      participantCount: 138,
    },
    {
      id: 4,
      order: 4,
      location: "그리스 아테네",
      imageUrl: "https://picsum.photos/seed/athens/200/160",
      period: "2024.04.19 ~ 2024.04.25 (7일)",
      participantCount: 130,
    },
  ],
  recommendation: {
    imageUrl: "https://picsum.photos/seed/amalfi/400/240",
    title: "이탈리아 아말피 해안",
    tags: ["이탈리아", "휴양"],
    description:
      "아름다운 해안 절경과 여유로운 휴양을 즐길 수 있는 완벽한 다음 목적지에요.",
  },
};

export const getRelayDetail = async (
  _id?: number,
): Promise<RelayDetailData> => {
  return MOCK_RELAY_DETAIL;
};
