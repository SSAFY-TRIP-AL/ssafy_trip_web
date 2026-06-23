import api from "../../../api/api";

export interface RelayRouteStep {
  userName: string;
  stepOrder: number;
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface RelayRoute {
  relayId: number;
  title: string;
  steps: RelayRouteStep[];
}

export const getRelayRoute = async (relayId: number): Promise<RelayRoute> => {
  const response = await api.get<RelayRoute>(`/relays/${relayId}/steps`);
  return response.data;
};
