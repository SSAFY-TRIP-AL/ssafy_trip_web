import api from "../../../../api/api";

export interface CreateRelayRequest {
  title: string;
  categoryId: number;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  content: string;
  photoUrl?: File | null;
}

export const createRelay = async (payload: CreateRelayRequest) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("categoryId", String(payload.categoryId));
  formData.append("address", payload.address);
  if (payload.latitude != null) {
    formData.append("latitude", String(payload.latitude));
  }
  if (payload.longitude != null) {
    formData.append("longitude", String(payload.longitude));
  }
  formData.append("content", payload.content);
  // if (payload.photoUrl) {
  //   formData.append("photoUrl", payload.photoUrl);
  // }
  const response = await api.post(`/relays`, formData);

  return response.data;
};
