import api from "../../../../api/api";

export type RelaySortOption = "latest" | "popular";

export interface RelayItem {
  id: number;
  title: string;
  locationName: string;
  category: string;
  participantCount: number;
  status: string;
  bookmarked: boolean;
  photoUrl: string;
  latitude: number;
  longitude: number;
}

export interface GetRelayListParams {
  keyword?: string;
  categoryId?: number | null;
  orderBy?: RelaySortOption;
  page?: number;
  pageSize?: number;
}

export interface GetRelayListResponse {
  items: RelayItem[];
  totalCount: number;
  totalPages: number;
}

export const RELAY_SORT_OPTIONS: { id: RelaySortOption; label: string }[] = [
  { id: "latest", label: "최신순" },
  { id: "popular", label: "인기순" },
];

interface RelayListItemDto {
  id: number;
  title: string;
  locationName: string;
  category: string;
  participantCount: number;
  status: string;
  lastParticipatedAt: string;
  createdAt: string;
  bookmarked: boolean;
  photoUrl: string;
  latitude: number;
  longitude: number;
}

interface RelayListResponseDto {
  relays: RelayListItemDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const getRelayList = async (
  params: GetRelayListParams = {},
): Promise<GetRelayListResponse> => {
  const { keyword = "", categoryId = null, orderBy = "", page = 1, pageSize = 18 } = params;

  const response = await api.get<RelayListResponseDto>("/relays", {
    params: {
      keyword: keyword.trim() || undefined,
      categoryId: categoryId ?? undefined,
      orderBy: orderBy,
      page: page - 1,
      size: pageSize,
    },
  });

  return {
    items: response.data.relays.map((relay) => ({
      id: relay.id,
      title: relay.title,
      locationName: relay.locationName,
      category: relay.category,
      participantCount: relay.participantCount,
      status: relay.status,
      bookmarked: relay.bookmarked,
      photoUrl: relay.photoUrl,
      latitude: relay.latitude,
      longitude: relay.longitude,
    })),
    totalCount: response.data.totalElements,
    totalPages: response.data.totalPages,
  };
};
