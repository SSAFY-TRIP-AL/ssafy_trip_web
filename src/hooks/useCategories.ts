import { useEffect, useState } from "react";
import { getCategories, type Category } from "../api/categoryApi";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error) => console.error(error));
  }, []);

  return { categories };
};
