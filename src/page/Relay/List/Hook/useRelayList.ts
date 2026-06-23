import { useEffect, useState } from "react";
import { getRelayList, type RelayItem, type RelaySortOption } from "../api/relayApi";
import { useDebouncedValue } from "../../../../Hook/useDebounce";

const PAGE_SIZE = 18;
const SEARCH_DEBOUNCE_MS = 300;

export type RelayViewMode = "grid" | "list";

export const useRelayList = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<number | null>(null);
  const [orderBy, setOrderBy] = useState<RelaySortOption>("latest");
  const [viewMode, setViewMode] = useState<RelayViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const [items, setItems] = useState<RelayItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedKeyword = useDebouncedValue(keyword, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedKeyword, category, orderBy]);

  useEffect(() => {
    let active = true;

    getRelayList({
      keyword: debouncedKeyword,
      categoryId: category,
      orderBy,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }).then((response) => {
      if (!active) return;
      setItems(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(Math.max(1, response.totalPages));
    });

    return () => {
      active = false;
    };
  }, [debouncedKeyword, category, orderBy, currentPage]);

  return {
    keyword,
    setKeyword,
    category,
    setCategory,
    orderBy,
    setOrderBy,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    items,
    totalCount,
    totalPages,
  };
};
