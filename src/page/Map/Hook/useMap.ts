import { useEffect, useState } from "react";
import { useDebouncedValue } from "../../../Hook/useDebounce";
import { getRelayList, type RelayItem } from "../../Relay/List/api/relayApi";
import { getRelayRoute, type RelayRoute } from "../api/mapApi";

const SEARCH_DEBOUNCE_MS = 300;
const MAP_PAGE_SIZE = 100;

export const useMap = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<number | null>(null);
  const [relays, setRelays] = useState<RelayItem[]>([]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [route, setRoute] = useState<RelayRoute | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  const debouncedKeyword = useDebouncedValue(keyword, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    let active = true;

    getRelayList({
      keyword: debouncedKeyword,
      categoryId: category,
      orderBy: "latest",
      page: 1,
      pageSize: MAP_PAGE_SIZE,
    }).then((response) => {
      if (active) setRelays(response.items);
    });

    return () => {
      active = false;
    };
  }, [debouncedKeyword, category]);

  const selectRelay = async (relayId: number) => {
    setSelectedId(relayId);
    setIsRouteLoading(true);
    try {
      const data = await getRelayRoute(relayId);
      setRoute(data);
    } catch (error) {
      console.log(error);
      setRoute(null);
    } finally {
      setIsRouteLoading(false);
    }
  };

  const closeRelay = () => {
    setSelectedId(null);
    setRoute(null);
  };

  return {
    keyword,
    setKeyword,
    category,
    setCategory,
    relays,
    selectedId,
    route,
    isRouteLoading,
    selectRelay,
    closeRelay,
  };
};
