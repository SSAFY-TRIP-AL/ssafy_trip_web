import api from "./api";

export const addBookmark = async (relayId: number): Promise<void> => {
  await api.post(`/relays/${relayId}/bookmarks`);
};

export const removeBookmark = async (relayId: number): Promise<void> => {
  await api.delete(`/relays/${relayId}/bookmarks`);
};
