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
    locationName: string;
    address: string;
    latitude: number;
    longitude: number;
    photoUrl: string;
    content: string;
    createdAt: string;
  }[];
}

export interface RelayPreviousStop {
  id: number;
  order: number;
  location: string;
  imageUrl: string;
  period: string;
  participantCount: number;
}

export interface RelayDetailData {
  id: number;
  title: string;
  status: string;
  category: string;
  participantCount: number;
  coverImageUrl: string;
  previousStops: RelayPreviousStop[];
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
      order: step.stepOrder,
      location: step.locationName,
      imageUrl: step.photoUrl,
      period: new Date(step.createdAt).toLocaleDateString(),
      participantCount: data.participantCount,
    })),
  };
};
