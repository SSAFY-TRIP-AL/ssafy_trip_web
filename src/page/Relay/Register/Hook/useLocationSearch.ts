import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "../../../../Hook/useDebounce";
import { toast } from "../../../../store/toastStore";

const KAKAO_REST_API_KEY = import.meta.env.VITE_KKAKO_REST_API_KEY;
const SEARCH_DEBOUNCE_MS = 300;
const MAX_SUGGESTIONS = 8;

export interface LocationSuggestion {
  id: string;
  placeName: string;
  addressName: string;
  lat: number;
  lng: number;
}

interface KakaoPlaceDocument {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
}

interface KakaoKeywordSearchResponse {
  documents: KakaoPlaceDocument[];
}

const kakaoLocalHeaders = {
  Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
};

export const useLocationSearch = () => {
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const skipNextSearchRef = useRef(false);
  const debouncedAddress = useDebouncedValue(address, SEARCH_DEBOUNCE_MS);

  async function searchPlaces(keyword: string) {
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
          keyword,
        )}&size=${MAX_SUGGESTIONS}`,
        { headers: kakaoLocalHeaders },
      );
      const data: KakaoKeywordSearchResponse = await response.json();
      const places: LocationSuggestion[] = (data.documents ?? []).map(
        (place) => ({
          id: place.id,
          placeName: place.place_name,
          addressName: place.road_address_name || place.address_name,
          lat: Number(place.y),
          lng: Number(place.x),
        }),
      );
      setSuggestions(places);
      setIsSuggestionsOpen(places.length > 0);
    } catch (error) {
      console.error(error);
      setSuggestions([]);
      setIsSuggestionsOpen(false);
    }
  }

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    const keyword = debouncedAddress.trim();
    if (!keyword) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      return;
    }

    searchPlaces(keyword);
  }, [debouncedAddress]);

  function selectSuggestion(suggestion: LocationSuggestion) {
    skipNextSearchRef.current = true;
    setAddress(suggestion.addressName || suggestion.placeName);
    setLatitude(suggestion.lat);
    setLongitude(suggestion.lng);
    setSuggestions([]);
    setIsSuggestionsOpen(false);
  }

  async function reverseGeocode(lat: number, lng: number) {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
      { headers: kakaoLocalHeaders },
    );
    const data = await response.json();
    return data.documents?.[0]?.address?.address_name ?? "";
  }

  function findCurrentLocation() {
    if (!navigator.geolocation) {
      toast.warning("이 브라우저에서는 위치 정보를 사용할 수 없습니다.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        console.log(lat, lng);
        setLatitude(lat);
        setLongitude(lng);

        try {
          const address = await reverseGeocode(lat, lng);
          if (address) {
            skipNextSearchRef.current = true;
            setAddress(address);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        toast.error("현재 위치를 가져오지 못했습니다.");
      },
    );
  }

  return {
    address,
    setAddress,
    latitude,
    longitude,
    suggestions,
    isSuggestionsOpen,
    setIsSuggestionsOpen,
    isLocating,
    selectSuggestion,
    findCurrentLocation,
  };
};
