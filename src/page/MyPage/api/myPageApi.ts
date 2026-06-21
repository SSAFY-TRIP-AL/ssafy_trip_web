import api from "../../../api/api";

export type RelayTabType = "PARTICIPATED" | "CREATED" | "LIKED";

export interface MyProfile {
  id: number;
  name: string;
  profileImage: string;
  bio: string;
  joinedAt: string;
  participatedCount: number;
  createdCount: number;
  likedCount: number;
}

export interface MyPageRelayItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  status: "진행중" | "완료";
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

export const getMyProfile = async (): Promise<MyProfile> => {
  const response = await api.get<MyProfile>("/users/me");
  return response.data;
};

export const updateMyProfile = async (
  payload: UpdateMyProfileRequest,
): Promise<MyProfile> => {
  const response = await api.patch<MyProfile>("/users/me", payload);
  return response.data;
};

export const withdrawMyAccount = async () => {
  await api.delete("/users/me");
};

export const getMyRelays = async (
  type: RelayTabType,
  page: number,
  pageSize: number,
): Promise<MyPageRelayListResponse> => {
  const response = await api.get<MyPageRelayListResponse>("/users/me/relays", {
    params: { type, page, pageSize },
  });
  return response.data;
};
