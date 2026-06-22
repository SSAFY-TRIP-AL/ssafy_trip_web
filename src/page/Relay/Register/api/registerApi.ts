import api from "../../../../api/api";

export interface CreateRelayRequest {
  title: string;
  categoryId: number;
  address: string;
  locationName: string;
  latitude?: number | null;
  longitude?: number | null;
  content: string;
  photoUrl?: string | null;
}
export interface JoinRelayRequest {
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  photoUrl: string;
  content: string;
}
export const createRelay = async (payload: CreateRelayRequest) => {
  const response = await api.post("/relays", payload);

  return response.data;
};

export const joinRelay = async (relayId: number, payload: JoinRelayRequest) => {
  const response = await api.post(`/relays/${relayId}/steps`, payload);

  return response.data;
};
