import { useEffect, useState } from "react";
import {
  getRelayList,
  RELAY_CATEGORIES,
  type RelayCategory,
  type RelayItem,
  type RelaySortOption,
} from "../api/relayApi";

const PAGE_SIZE = 18;

export type RelayViewMode = "grid" | "list";

export const useRelayList = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<RelayCategory | "전체">("전체");
  const [sort, setSort] = useState<RelaySortOption>("latest");
  const [viewMode, setViewMode] = useState<RelayViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const [items, setItems] = useState<RelayItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, category, sort]);

  useEffect(() => {
    let active = true;

    getRelayList({
      keyword,
      category,
      sort,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }).then((response) => {
      if (!active) return;
      setItems(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
    });

    return () => {
      active = false;
    };
  }, [keyword, category, sort, currentPage]);

  return {
    keyword,
    setKeyword,
    category,
    setCategory,
    sort,
    setSort,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    items,
    totalCount,
    totalPages,
    categories: RELAY_CATEGORIES,
  };
};
