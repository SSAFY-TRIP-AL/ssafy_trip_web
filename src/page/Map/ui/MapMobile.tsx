import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, X, LocateFixed, Plus, Minus, Users } from "lucide-react";
import mobileStyle from "../css/MapMobile.module.css";
import "../../../style.css";
import { useCategories } from "../../../hooks/useCategories";
import { getCategoryStyle } from "../../../constants/categoryPalette";
import { useMap } from "../Hook/useMap";

interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoLatLngBounds {
  extend(latlng: KakaoLatLng): void;
}

interface KakaoMapInstance {
  setBounds(
    bounds: KakaoLatLngBounds,
    paddingTop?: number,
    paddingRight?: number,
    paddingBottom?: number,
    paddingLeft?: number,
  ): void;
  setCenter(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
  getLevel(): number;
}

interface KakaoOverlay {
  setMap(map: KakaoMapInstance | null): void;
}

interface KakaoMaps {
  load(callback: () => void): void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  LatLngBounds: new () => KakaoLatLngBounds;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number },
  ) => KakaoMapInstance;
  Marker: new (options: { position: KakaoLatLng; map?: KakaoMapInstance }) => KakaoOverlay;
  Polyline: new (options: {
    path: KakaoLatLng[];
    strokeWeight: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeStyle: string;
  }) => KakaoOverlay;
  CustomOverlay: new (options: {
    position: KakaoLatLng;
    content: HTMLElement;
    xAnchor: number;
    yAnchor: number;
    zIndex: number;
  }) => KakaoOverlay;
  event: {
    addListener(target: KakaoOverlay, type: string, handler: () => void): void;
  };
}

declare global {
  interface Window {
    kakao: {
      maps: KakaoMaps;
    };
  }
}

const KAKAO_JAVASCRIPT_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_API_KEY;

const KOREA_CENTER = { lat: 36.5, lng: 127.8 };
const KOREA_ZOOM_LEVEL = 13;
const MY_LOCATION_ZOOM_LEVEL = 5;
const FLOW_DOT_COUNT = 6;

const SHEET_PEEK_HEIGHT = 80;
const SHEET_FULL_RATIO = 0.72;
// const SHEET_CLOSE_THRESHOLD = SHEET_PEEK_HEIGHT * 0.55;

function buildFlowPoints(path: { lat: number; lng: number }[], count: number) {
  const segments: {
    from: { lat: number; lng: number };
    to: { lat: number; lng: number };
    length: number;
  }[] = [];
  let totalLength = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    const length = Math.hypot(to.lat - from.lat, to.lng - from.lng);
    segments.push({ from, to, length });
    totalLength += length;
  }
  if (totalLength === 0 || segments.length === 0) return [];

  const points: { lat: number; lng: number }[] = [];
  for (let i = 0; i < count; i++) {
    const distance = (totalLength * i) / Math.max(count - 1, 1);
    let covered = 0;
    const segment =
      segments.find((current) => {
        if (distance <= covered + current.length) return true;
        covered += current.length;
        return false;
      }) ?? segments[segments.length - 1];
    const ratio = segment.length === 0 ? 0 : (distance - covered) / segment.length;
    points.push({
      lat: segment.from.lat + (segment.to.lat - segment.from.lat) * ratio,
      lng: segment.from.lng + (segment.to.lng - segment.from.lng) * ratio,
    });
  }
  return points;
}

export default function MapMobile() {
  const navigate = useNavigate();
  const {
    keyword,
    setKeyword,
    category,
    setCategory,
    relays,
    selectedId,
    route,
    summary,
    isSummaryLoading,
    summaryError,
    selectRelay,
    closeRelay,
  } = useMap();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(SHEET_PEEK_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const [fullHeight, setFullHeight] = useState(() =>
    Math.round(window.innerHeight * SHEET_FULL_RATIO),
  );
  const { categories } = useCategories();
  const categoryRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef(0);
  const dragStartHeightRef = useRef(SHEET_PEEK_HEIGHT);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null);
  const markerInstancesRef = useRef<
    { id: number; overlay: KakaoOverlay; element: HTMLDivElement }[]
  >([]);
  const polylineInstancesRef = useRef<KakaoOverlay[]>([]);
  const flowDotOverlaysRef = useRef<KakaoOverlay[]>([]);
  const relayStopOverlaysRef = useRef<KakaoOverlay[]>([]);
  const directionArrowOverlaysRef = useRef<KakaoOverlay[]>([]);

  const selected = relays.find((relay) => relay.id === selectedId) ?? null;

  function clearRelayPath() {
    polylineInstancesRef.current.forEach((line) => line.setMap(null));
    polylineInstancesRef.current = [];
    flowDotOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    flowDotOverlaysRef.current = [];
    relayStopOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    relayStopOverlaysRef.current = [];
    directionArrowOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    directionArrowOverlaysRef.current = [];
  }

  function handleClosePanel() {
    closeRelay();
    clearRelayPath();
    setSheetHeight(SHEET_PEEK_HEIGHT);
  }

  useEffect(() => {
    if (selectedId == null) return;
    setFullHeight(Math.round(window.innerHeight * SHEET_FULL_RATIO));
    setSheetHeight(SHEET_PEEK_HEIGHT);
  }, [selectedId]);

  useEffect(() => {
    function handleResize() {
      setFullHeight(Math.round(window.innerHeight * SHEET_FULL_RATIO));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleSheetDragStart(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartYRef.current = event.clientY;
    dragStartHeightRef.current = sheetHeight;
    setIsDragging(true);
  }

  function handleSheetDragMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    const delta = dragStartYRef.current - event.clientY;
    const next = Math.min(
      fullHeight,
      Math.max(SHEET_PEEK_HEIGHT * 0.4, dragStartHeightRef.current + delta),
    );
    setSheetHeight(next);
  }

  function handleSheetDragEnd() {
    if (!isDragging) return;
    setIsDragging(false);
    const dragDistance = Math.abs(sheetHeight - dragStartHeightRef.current);

    if (dragDistance < 6) {
      setSheetHeight(sheetHeight >= fullHeight * 0.9 ? SHEET_PEEK_HEIGHT : fullHeight);
      return;
    }

    // if (sheetHeight < SHEET_CLOSE_THRESHOLD) {
    //   handleClosePanel();
    //   return;
    // }

    const midPoint = (SHEET_PEEK_HEIGHT + fullHeight) / 2;
    setSheetHeight(sheetHeight >= midPoint ? fullHeight : SHEET_PEEK_HEIGHT);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JAVASCRIPT_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapContainerRef.current) return;

        const map = new window.kakao.maps.Map(mapContainerRef.current, {
          center: new window.kakao.maps.LatLng(KOREA_CENTER.lat, KOREA_CENTER.lng),
          level: KOREA_ZOOM_LEVEL,
        });
        mapInstanceRef.current = map;
        setIsMapReady(true);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!isMapReady || !map) return;

    markerInstancesRef.current.forEach(({ overlay }) => overlay.setMap(null));
    markerInstancesRef.current = relays.map((relay) => {
      const element = document.createElement("div");
      element.className = mobileStyle.customMarker;
      const pin = document.createElement("div");
      pin.className = mobileStyle.customMarkerPin;
      if (relay.id === selectedId) {
        pin.classList.add(mobileStyle.customMarkerPinActive);
      }
      element.appendChild(pin);
      element.addEventListener("click", () => selectRelay(relay.id));

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(relay.latitude, relay.longitude),
        content: element,
        xAnchor: 0.5,
        yAnchor: 1,
        zIndex: 3,
      });
      overlay.setMap(map);
      return { id: relay.id, overlay, element };
    });
  }, [isMapReady, relays, selectedId, selectRelay]);

  useEffect(() => {
    clearRelayPath();
    const map = mapInstanceRef.current;
    if (!map || !route || route.steps.length === 0) return;

    const stops = [...route.steps].sort((a, b) => a.stepOrder - b.stepOrder);

    const path = stops.map((stop) => new window.kakao.maps.LatLng(stop.latitude, stop.longitude));

    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach((latlng) => bounds.extend(latlng));
    map.setBounds(bounds, 60, 40, 60, 40);

    if (stops.length < 2) return;

    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 3,
      strokeColor: "#2340fa",
      strokeOpacity: 0.6,
      strokeStyle: "shortdash",
    });
    polyline.setMap(map);
    polylineInstancesRef.current.push(polyline);

    relayStopOverlaysRef.current = stops.map((stop, index) => {
      const dot = document.createElement("div");
      dot.className = mobileStyle.relayStopDot;
      dot.textContent = String(index + 1);
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(stop.latitude, stop.longitude),
        content: dot,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 4,
      });
      overlay.setMap(map);
      return overlay;
    });

    directionArrowOverlaysRef.current = stops.slice(0, -1).map((stop, index) => {
      const next = stops[index + 1];
      const midLat = (stop.latitude + next.latitude) / 2;
      const midLng = (stop.longitude + next.longitude) / 2;
      const bearing =
        (Math.atan2(next.longitude - stop.longitude, next.latitude - stop.latitude) * 180) /
        Math.PI;

      const arrow = document.createElement("div");
      arrow.className = mobileStyle.relayDirectionArrow;
      arrow.style.transform = `rotate(${bearing}deg)`;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(midLat, midLng),
        content: arrow,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 4,
      });
      overlay.setMap(map);
      return overlay;
    });

    const flowPoints = buildFlowPoints(
      stops.map((stop) => ({ lat: stop.latitude, lng: stop.longitude })),
      FLOW_DOT_COUNT,
    );
    flowDotOverlaysRef.current = flowPoints.map((point, index) => {
      const dot = document.createElement("div");
      dot.className = mobileStyle.relayFlowDot;
      dot.style.animationDelay = `${(index * 1.6) / FLOW_DOT_COUNT}s`;
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(point.lat, point.lng),
        content: dot,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 5,
      });
      overlay.setMap(map);
      return overlay;
    });
  }, [route]);

  function selectCategory(categoryId: number | null) {
    setCategory(categoryId);
    setIsCategoryOpen(false);
    handleClosePanel();
  }

  function zoomIn() {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() - 1);
  }

  function zoomOut() {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() + 1);
  }

  function moveToMyLocation() {
    const map = mapInstanceRef.current;
    if (!map || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const location = new window.kakao.maps.LatLng(coords.latitude, coords.longitude);
      map.setCenter(location);
      map.setLevel(MY_LOCATION_ZOOM_LEVEL);
    });
  }

  return (
    <div className={mobileStyle.mapPage}>
      <div ref={mapContainerRef} className={mobileStyle.mapContainer} />

      <div className={mobileStyle.searchHeader}>
        <div className={mobileStyle.searchInputBox}>
          <Search size={18} className={mobileStyle.searchIcon} />
          <input
            type="text"
            placeholder="여행지, 도시, 명소를 검색하세요"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <div className={mobileStyle.categoryWrapper} ref={categoryRef}>
          <button
            type="button"
            className={mobileStyle.categorySelect}
            onClick={() => setIsCategoryOpen((prev) => !prev)}
          >
            <span>
              {category != null ? categories.find((c) => c.id === category)?.name : "카테고리"}
            </span>
            <ChevronDown size={16} />
          </button>
          {isCategoryOpen && (
            <ul className={mobileStyle.categoryMenu}>
              <li>
                <button
                  type="button"
                  className={`${mobileStyle.categoryOption} ${
                    category === null ? mobileStyle.categoryOptionActive : ""
                  }`}
                  onClick={() => selectCategory(null)}
                >
                  전체
                </button>
              </li>
              {categories.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`${mobileStyle.categoryOption} ${
                      category === item.id ? mobileStyle.categoryOptionActive : ""
                    }`}
                    onClick={() => selectCategory(item.id)}
                  >
                    <span
                      className={mobileStyle.categoryDot}
                      style={{
                        backgroundColor: getCategoryStyle(index).color,
                      }}
                    />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={mobileStyle.mapControls}>
        <button
          type="button"
          className={mobileStyle.controlBtn}
          aria-label="내 위치로 이동"
          onClick={moveToMyLocation}
        >
          <LocateFixed size={18} />
        </button>
        <div className={mobileStyle.zoomGroup}>
          <button
            type="button"
            className={mobileStyle.controlBtn}
            aria-label="확대"
            onClick={zoomIn}
          >
            <Plus size={18} />
          </button>
          <button
            type="button"
            className={mobileStyle.controlBtn}
            aria-label="축소"
            onClick={zoomOut}
          >
            <Minus size={18} />
          </button>
        </div>
      </div>

      {selected && (
        <aside
          className={mobileStyle.detailSheet}
          style={{
            height: sheetHeight,
            transition: isDragging ? "none" : "height 0.25s ease",
          }}
        >
          <div
            className={mobileStyle.sheetDragZone}
            onPointerDown={handleSheetDragStart}
            onPointerMove={handleSheetDragMove}
            onPointerUp={handleSheetDragEnd}
            onPointerCancel={handleSheetDragEnd}
          >
            <div className={mobileStyle.sheetHandle} />
          </div>
          <button type="button" className={mobileStyle.detailCloseBtn} onClick={handleClosePanel}>
            <X size={18} />
          </button>
          <div
            className={mobileStyle.sheetScroll}
            style={{
              overflowY: !isDragging && sheetHeight >= fullHeight - 1 ? "auto" : "hidden",
            }}
          >
            <div className={mobileStyle.detailBody}>
              {(() => {
                const index = Math.max(
                  0,
                  categories.findIndex((c) => c.name === selected.category),
                );
                const style = getCategoryStyle(index);
                return (
                  <span
                    className={mobileStyle.detailTag}
                    style={{
                      backgroundColor: style.tint,
                      color: style.color,
                    }}
                  >
                    {selected.category}
                  </span>
                );
              })()}
              <span className={mobileStyle.detailTitle}>{selected.title}</span>

              <div className={mobileStyle.detailMetaRow}>
                <span className={mobileStyle.detailMetaItem}>
                  <Users size={14} />
                  참여자 {selected.participantCount}명
                </span>
              </div>

              <img
                src={selected.photoUrl}
                alt={selected.title}
                className={mobileStyle.detailImage}
              />

              <div className={mobileStyle.aiSummaryBox}>
                <span className={mobileStyle.aiSummaryLabel}>AI 요약</span>
                {isSummaryLoading ? (
                  <p className={mobileStyle.aiSummaryPlaceholder}>AI 요약을 불러오는 중...</p>
                ) : summaryError ? (
                  <p className={mobileStyle.aiSummaryPlaceholder}>{summaryError}</p>
                ) : summary ? (
                  <>
                    <p className={mobileStyle.aiSummaryText}>{summary.summary}</p>
                    {summary.highlights.length > 0 && (
                      <ul className={mobileStyle.aiHighlightList}>
                        {summary.highlights.map((highlight, index) => (
                          <li key={index} className={mobileStyle.aiHighlightItem}>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <p className={mobileStyle.aiSummaryPlaceholder}>AI 요약 기능은 준비 중입니다.</p>
                )}
              </div>

              <div className={mobileStyle.detailActions}>
                <button
                  type="button"
                  className={mobileStyle.relayStartBtn}
                  onClick={() => navigate(`/relay/${selected.id}/step`)}
                >
                  릴레이 이어하기
                </button>
                <button
                  type="button"
                  className={mobileStyle.relayDetailBtn}
                  onClick={() => navigate(`/relay/detail/${selected.id}`)}
                >
                  릴레이 상세보기
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
