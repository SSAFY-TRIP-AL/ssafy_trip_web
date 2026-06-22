import { useEffect, useState } from "react";
import { getCategories, type Category } from "../api/categoryApi";

export const useCategories = (enabled = true) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!enabled) return;

    getCategories().then(setCategories).catch(console.error);
  }, [enabled]);

  return { categories };
};
