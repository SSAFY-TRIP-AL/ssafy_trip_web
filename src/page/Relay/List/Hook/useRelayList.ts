import { useEffect, useState } from "react";
import { getRelayList, type RelayItem, type RelaySortOption } from "../api/relayApi";

const PAGE_SIZE = 18;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, category, orderBy]);

  useEffect(() => {
    let active = true;

    getRelayList({
      keyword,
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
  }, [keyword, category, orderBy, currentPage]);

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
