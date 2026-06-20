import api from "../../../../api/api";

export interface CreateRelayRequest {
  title: string;
  categoryId: number;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  content: string;
  // photoUrl?: File | null;
}

export const createRelay = async (payload: CreateRelayRequest) => {
  const response = await api.post("/relays", payload);

  return response.data;
};
