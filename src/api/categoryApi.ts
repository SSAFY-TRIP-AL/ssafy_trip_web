import api from "./api";

export interface Category {
  id: number;
  name: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  const data = response.data as Record<string, Category[]>;
  return Object.values(data).flat();
};
