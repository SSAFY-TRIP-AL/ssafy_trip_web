import api from "../../../api/api";

export interface RelaySummary {
  id: number;
  title: string;
  category: string;
  participantCount: number;
  photoUrl: string;
}

export interface OngoingRelay extends RelaySummary {
  lastParticipatedAt: string;
}

export interface RankingUser {
  id: number;
  name: string;
  profileImage: string;
  participationCount: number;
}

export interface MainInfo {
  userCount: number;
  relayCount: number;
  relays: {
    relays: OngoingRelay[];
  };
  ranking: RankingUser[];
}

export const getMainInfo = async () => {
  const response = await api.get<MainInfo>("/main");
  return response.data;
};
