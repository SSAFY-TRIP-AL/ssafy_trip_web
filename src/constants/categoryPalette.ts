export interface CategoryStyle {
  color: string;
  tint: string;
}

export const CATEGORY_PALETTE: CategoryStyle[] = [
  { color: "#22c55e", tint: "#e8f9ee" },
  { color: "#2340fa", tint: "#e8ecfe" },
  { color: "#a855f7", tint: "#f3e9fd" },
  { color: "#f97316", tint: "#fef0e4" },
  { color: "#ef4444", tint: "#fde9e9" },
];

export function getCategoryStyle(index: number): CategoryStyle {
  return CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
}
