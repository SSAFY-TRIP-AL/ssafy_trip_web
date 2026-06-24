import { useEffect, useState } from "react";
import { useDebouncedValue } from "../../../Hook/useDebounce";
import { getRelayList, type RelayItem } from "../../Relay/List/api/relayApi";
import { getRelayRoute, type RelayRoute } from "../api/mapApi";
import { getAiSummary, type AiSummary } from "../../../api/aiApi";
// import { useNavigate } from "react-router-dom";

const SEARCH_DEBOUNCE_MS = 300;
const MAP_PAGE_SIZE = 100;

export const useMap = () => {
  // const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<number | null>(null);
  const [relays, setRelays] = useState<RelayItem[]>([]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [route, setRoute] = useState<RelayRoute | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  const [summary, setSummary] = useState<AiSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");

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

  const fetchSummary = async (locationName: string, category?: string) => {
    if (!locationName) return;
    setSummary(null);
    setSummaryError("");
    setIsSummaryLoading(true);
    try {
      const data = await getAiSummary(locationName, category);
      setSummary(data);
    } catch (error) {
      console.log(error);
      setSummaryError("AI 요약을 불러오지 못했습니다.");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const selectRelay = async (relayId: number) => {
    setSelectedId(relayId);

    const relay = relays.find((item) => item.id === relayId);

    setIsRouteLoading(true);
    try {
      const data = await getRelayRoute(relayId);
      setRoute(data);

      // 마지막(최신) 스텝의 locationName으로 AI 요약 호출
      const latestStep = [...data.steps].sort((a, b) => a.stepOrder - b.stepOrder).at(-1);
      fetchSummary(latestStep?.locationName ?? "", relay?.category);
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
    setSummary(null);
    setSummaryError("");
    setIsSummaryLoading(false);
  };

  // const goAddRelayStep = () => {
  //   navigate("/")
  // }

  return {
    keyword,
    setKeyword,
    category,
    setCategory,
    relays,
    selectedId,
    route,
    isRouteLoading,
    summary,
    isSummaryLoading,
    summaryError,
    selectRelay,
    closeRelay,
  };
};
