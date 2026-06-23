import api from "../../../../api/api";

export interface RelayDetailResponse {
  id: number;
  title: string;
  category: string;
  participantCount: number;
  status: string;
  createdAt: string;
  lastParticipatedAt: string;

  steps: {
    stepOrder: number;
    userName: string;
    locationName: string;
    address: string;
    latitude: number;
    longitude: number;
    photoUrl: string;
    content: string;
    createdAt: string;
  }[];

  bookmarked: boolean;
}

export interface RelayPreviousStop {
  id: number;
  userName: string;
  order: number;
  location: string;
  imageUrl: string;
  period: string;
  participantCount: number;
  content: string;
}

export interface RelayDetailData {
  id: number;
  title: string;
  status: string;
  category: string;
  participantCount: number;
  coverImageUrl: string;
  previousStops: RelayPreviousStop[];
  bookmarked: boolean;
}

export const getRelayDetail = async (id: number): Promise<RelayDetailData> => {
  const res = await api.get<RelayDetailResponse>(`/relays/${id}`);

  const data = res.data;

  return {
    id: data.id,
    title: data.title,
    status: data.status,
    category: data.category,
    participantCount: data.participantCount,
    coverImageUrl: data.steps.at(-1)?.photoUrl ?? "",
    previousStops: data.steps.map((step) => ({
      id: step.stepOrder,
      userName: step.userName,
      order: step.stepOrder,
      location: step.locationName,
      imageUrl: step.photoUrl,
      period: new Date(step.createdAt).toLocaleDateString(),
      participantCount: data.participantCount,
      content: step.content,
    })),
    bookmarked: data.bookmarked,
  };
};
