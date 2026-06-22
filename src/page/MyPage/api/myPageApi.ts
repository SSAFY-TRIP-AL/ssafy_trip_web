import api from "../../../api/api";

export type RelayTabType = "PARTICIPATED" | "CREATED" | "LIKED";

export interface MyProfile {
  id: number;
  name: string;
  email: string;
  profileImage: string;
  participationCount: number;
  createdCount: number;
  likedCount: number;
  provider: string;
  createdAt: string;
}

export interface MyPageRelayItem {
  id: number;
  title: string;
  content: string;
  photoUrl: string;
  status: string;
  date: string;
}

export interface MyPageRelayListResponse {
  items: MyPageRelayItem[];
  totalCount: number;
  totalPages: number;
}

export interface UpdateMyProfileRequest {
  name: string;
  profileImage?: string;
}

export interface MyPageListParams {
  page?: number;
  size?: number;
  sort?: string[];
}

const MY_PAGE_LIST_DEFAULT_PAGE = 0;
const MY_PAGE_LIST_MAX_SIZE = 2;

const toMyPageListQuery = ({
  page = MY_PAGE_LIST_DEFAULT_PAGE,
  size = MY_PAGE_LIST_MAX_SIZE,
  sort = [],
}: MyPageListParams = {}) => ({
  page,
  size: Math.min(size, MY_PAGE_LIST_MAX_SIZE),
  sort,
});

interface MyRelayListItemDto {
  id: number;
  title: string;
  content: string;
  photoUrl: string;
  status: string;
  date: string;
}

interface MyRelayListResponseDto {
  relays: MyRelayListItemDto[];
  totalElements: number;
  totalPages: number;
}

interface CreatedRelayListItemDto {
  id: number;
  title: string;
  content: string;
  category: string;
  participantCount: number;
  status: string;
  photoUrl: string;
  createdAt: string;
}

interface CreatedRelayListResponseDto {
  relays: CreatedRelayListItemDto[];
  totalElements: number;
  totalPages: number;
}

interface BookmarkListItemDto {
  relayId: number;
  title: string;
  category: string;
  participantCount: number;
  photoUrl: string;
}

interface BookmarkListResponseDto {
  bookmarks: BookmarkListItemDto[];
  totalElements: number;
  totalPages: number;
}

const toMyRelayListResponse = (dto: MyRelayListResponseDto): MyPageRelayListResponse => ({
  items: dto.relays.map((relay) => ({
    id: relay.id,
    title: relay.title,
    content: relay.content,
    photoUrl: relay.photoUrl,
    status: relay.status,
    date: relay.date,
  })),
  totalCount: dto.totalElements,
  totalPages: dto.totalPages,
});

const toCreatedRelayListResponse = (dto: CreatedRelayListResponseDto): MyPageRelayListResponse => ({
  items: dto.relays.map((relay) => ({
    id: relay.id,
    title: relay.title,
    content: relay.content,
    photoUrl: relay.photoUrl,
    status: relay.status,
    date: relay.createdAt,
  })),
  totalCount: dto.totalElements,
  totalPages: dto.totalPages,
});

const toBookmarkListResponse = (dto: BookmarkListResponseDto): MyPageRelayListResponse => ({
  items: dto.bookmarks.map((bookmark) => ({
    id: bookmark.relayId,
    title: bookmark.title,
    content: bookmark.category,
    photoUrl: bookmark.photoUrl,
    status: "",
    date: "",
  })),
  totalCount: dto.totalElements,
  totalPages: dto.totalPages,
});

// 프로필 불러오기
export const getMyProfile = async (): Promise<MyProfile> => {
  const response = await api.get<MyProfile>("/users/me");
  return response.data;
};

export const updateMyProfile = async (payload: UpdateMyProfileRequest): Promise<MyProfile> => {
  const response = await api.patch<MyProfile>("/users/me", payload);
  return response.data;
};

export const withdrawMyAccount = async () => {
  await api.delete("/users/me");
};

// 내가 참여한 릴레이 리스트
export const getMyRelays = async (params?: MyPageListParams): Promise<MyPageRelayListResponse> => {
  const response = await api.get<MyRelayListResponseDto>("/users/me/relays", {
    params: toMyPageListQuery(params),
    paramsSerializer: { indexes: null },
  });
  return toMyRelayListResponse(response.data);
};

// 내가 북마크한 릴레이 리스트
export const getMyBookmarks = async (
  params?: MyPageListParams,
): Promise<MyPageRelayListResponse> => {
  const response = await api.get<BookmarkListResponseDto>("/users/me/bookmarks", {
    params: toMyPageListQuery(params),
    paramsSerializer: { indexes: null },
  });
  return toBookmarkListResponse(response.data);
};

// 내가 시작한 릴레이 리스트
export const getMyCreatedRelays = async (
  params?: MyPageListParams,
): Promise<MyPageRelayListResponse> => {
  const response = await api.get<CreatedRelayListResponseDto>("/users/me/relays/created", {
    params: toMyPageListQuery(params),
    paramsSerializer: { indexes: null },
  });
  return toCreatedRelayListResponse(response.data);
};
