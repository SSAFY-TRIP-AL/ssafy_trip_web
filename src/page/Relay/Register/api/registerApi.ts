export interface CreateRelayRequest {
  title: string;
  categoryId: string;
  location: string;
  description: string;
  image?: File | null;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createRelay = async (payload: CreateRelayRequest) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("categoryId", payload.categoryId);
  formData.append("location", payload.location);
  formData.append("description", payload.description);
  if (payload.image) {
    formData.append("image", payload.image);
  }

  const response = await fetch(`${BASE_URL}/relays`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};
