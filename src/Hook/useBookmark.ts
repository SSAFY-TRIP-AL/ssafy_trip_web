import { useEffect, useState } from "react";
import { addBookmark, removeBookmark } from "../api/bookmarkApi";

export const useBookmark = (relayId: number, initialBookmarked = false) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const toggleBookmark = async () => {
    if (isToggling) return;

    const next = !isBookmarked;
    setIsBookmarked(next);
    setIsToggling(true);

    try {
      if (next) {
        await addBookmark(relayId);
      } else {
        await removeBookmark(relayId);
      }
    } catch (error) {
      setIsBookmarked(!next);
      console.error(error);
    } finally {
      setIsToggling(false);
    }
  };

  return { isBookmarked, toggleBookmark };
};
