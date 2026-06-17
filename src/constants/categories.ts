export interface Category {
  id: string;
  label: string;
  color: string;
  tint: string;
}

export const CATEGORIES: Category[] = [
  { id: "nature", label: "자연/경관", color: "#22c55e", tint: "#e8f9ee" },
  { id: "culture", label: "문화/역사", color: "#2340fa", tint: "#e8ecfe" },
  { id: "city", label: "도시/명소", color: "#a855f7", tint: "#f3e9fd" },
  { id: "activity", label: "액티비티", color: "#f97316", tint: "#fef0e4" },
  { id: "food", label: "맛집/미식", color: "#ef4444", tint: "#fde9e9" },
];

export function getCategory(id: string) {
  return CATEGORIES.find((category) => category.id === id) ?? CATEGORIES[0];
}
