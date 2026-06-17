import { useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronDown,
  LayoutGrid,
  X,
  LocateFixed,
  Plus,
  Minus,
} from "lucide-react";
import desktopStyle from "../css/MapDesktop.module.css";
import "../../../style.css";
import { CATEGORIES, getCategory } from "../../../constants/categories";

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_JAVASCRIPT_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_API_KEY;

const KOREA_CENTER = { lat: 36.5, lng: 127.8 };
const KOREA_ZOOM_LEVEL = 12;
const MY_LOCATION_ZOOM_LEVEL = 5;

const markers = [
  {
    id: 1,
    name: "서울 남산타워",
    categoryId: "city",
    lat: 37.5512,
    lng: 126.9882,
    image: "https://picsum.photos/seed/namsan/480/320",
    summary:
      "서울의 대표적인 랜드마크로, 아름다운 전망과 야경을 감상할 수 있는 곳입니다.",
    participants: 128,
    duration: "2~3시간",
  },
  {
    id: 2,
    name: "서울 가로수길",
    categoryId: "city",
    lat: 37.5196,
    lng: 127.0227,
    image: "https://picsum.photos/seed/garosugil/480/320",
    summary: "트렌디한 카페와 편집숍이 모여있는 서울의 대표 산책 거리입니다.",
    participants: 76,
    duration: "2시간",
  },
  {
    id: 3,
    name: "이태원 거리",
    categoryId: "culture",
    lat: 37.5345,
    lng: 126.9947,
    image: "https://picsum.photos/seed/itaewon/480/320",
    summary: "다양한 나라의 음식과 문화를 한 번에 경험할 수 있는 거리입니다.",
    participants: 102,
    duration: "3시간",
  },
  {
    id: 4,
    name: "부산 해운대",
    categoryId: "activity",
    lat: 35.1587,
    lng: 129.1604,
    image: "https://picsum.photos/seed/haeundae/480/320",
    summary: "다양한 액티비티와 먹거리가 가득한 부산의 대표 해변입니다.",
    participants: 152,
    duration: "하루",
  },
  {
    id: 5,
    name: "부산 광안리",
    categoryId: "food",
    lat: 35.1532,
    lng: 129.1186,
    image: "https://picsum.photos/seed/gwangalli/480/320",
    summary: "광안대교의 야경과 함께 신선한 해산물을 즐길 수 있는 해변입니다.",
    participants: 88,
    duration: "반나절",
  },
];

const relays = [
  { id: 1, name: "서울 도심 릴레이", markerIds: [2, 3, 1] },
  { id: 2, name: "부산 해변 릴레이", markerIds: [5, 4] },
];

const FLOW_DOT_COUNT = 6;

function findRelayByLastMarkerId(markerId: number) {
  return (
    relays.find(
      (relay) => relay.markerIds[relay.markerIds.length - 1] === markerId,
    ) ?? null
  );
}

function isRelayEndpoint(markerId: number) {
  return findRelayByLastMarkerId(markerId) !== null;
}

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
    const ratio =
      segment.length === 0 ? 0 : (distance - covered) / segment.length;
    points.push({
      lat: segment.from.lat + (segment.to.lat - segment.from.lat) * ratio,
      lng: segment.from.lng + (segment.to.lng - segment.from.lng) * ratio,
    });
  }
  return points;
}

export default function MapDesktop() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstancesRef = useRef<
    { id: number; categoryId: string; instance: any }[]
  >([]);
  const polylineInstancesRef = useRef<any[]>([]);
  const flowDotOverlaysRef = useRef<any[]>([]);
  const relayStopOverlaysRef = useRef<any[]>([]);

  const selected = markers.find((marker) => marker.id === selectedId) ?? null;

  function clearRelayPath() {
    polylineInstancesRef.current.forEach((line) => line.setMap(null));
    polylineInstancesRef.current = [];
    flowDotOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    flowDotOverlaysRef.current = [];
    relayStopOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    relayStopOverlaysRef.current = [];
  }

  function drawRelayPath(markerId: number) {
    clearRelayPath();
    const map = mapInstanceRef.current;
    const relay = findRelayByLastMarkerId(markerId);
    if (!map || !relay) return;

    const stops = relay.markerIds
      .map((id) => markers.find((marker) => marker.id === id))
      .filter((marker): marker is (typeof markers)[number] => Boolean(marker));
    if (stops.length < 2) return;

    const path = stops.map(
      (stop) => new window.kakao.maps.LatLng(stop.lat, stop.lng),
    );

    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach((latlng: any) => bounds.extend(latlng));
    map.setBounds(bounds, 80, 80, 80, 80);

    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 3,
      strokeColor: "#2340fa",
      strokeOpacity: 0.6,
      strokeStyle: "shortdash",
    });
    polyline.setMap(map);
    polylineInstancesRef.current.push(polyline);

    relayStopOverlaysRef.current = stops
      .filter((stop) => stop.id !== markerId)
      .map((stop) => {
        const dot = document.createElement("div");
        dot.className = desktopStyle.relayStopDot;
        const overlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(stop.lat, stop.lng),
          content: dot,
          xAnchor: 0.5,
          yAnchor: 0.5,
          zIndex: 4,
        });
        overlay.setMap(map);
        return overlay;
      });

    const flowPoints = buildFlowPoints(stops, FLOW_DOT_COUNT);
    flowDotOverlaysRef.current = flowPoints.map((point, index) => {
      const dot = document.createElement("div");
      dot.className = desktopStyle.relayFlowDot;
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
  }

  function handleMarkerSelect(markerId: number) {
    setSelectedId(markerId);
    drawRelayPath(markerId);
  }

  function handleClosePanel() {
    setSelectedId(null);
    clearRelayPath();
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
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
          center: new window.kakao.maps.LatLng(
            KOREA_CENTER.lat,
            KOREA_CENTER.lng,
          ),
          level: KOREA_ZOOM_LEVEL,
        });
        mapInstanceRef.current = map;

        markerInstancesRef.current = markers
          .filter((marker) => isRelayEndpoint(marker.id))
          .map((marker) => {
            const instance = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(marker.lat, marker.lng),
              map,
            });
            window.kakao.maps.event.addListener(instance, "click", () => {
              handleMarkerSelect(marker.id);
            });
            return { id: marker.id, categoryId: marker.categoryId, instance };
          });
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    markerInstancesRef.current.forEach(({ categoryId, instance }) => {
      const visible = !activeCategoryId || categoryId === activeCategoryId;
      instance.setMap(visible ? mapInstanceRef.current : null);
    });
  }, [activeCategoryId]);

  function selectCategory(categoryId: string | null) {
    setActiveCategoryId(categoryId);
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
      const location = new window.kakao.maps.LatLng(
        coords.latitude,
        coords.longitude,
      );
      map.setCenter(location);
      map.setLevel(MY_LOCATION_ZOOM_LEVEL);
    });
  }

  return (
    <div className={desktopStyle.mapPage}>
      <div ref={mapContainerRef} className={desktopStyle.mapContainer} />

      <div className={desktopStyle.searchHeader}>
        <div className={desktopStyle.searchInputBox}>
          <Search size={18} className={desktopStyle.searchIcon} />
          <input type="text" placeholder="여행지, 도시, 명소를 검색하세요" />
        </div>
        <div className={desktopStyle.categoryWrapper} ref={categoryRef}>
          <button
            type="button"
            className={desktopStyle.categorySelect}
            onClick={() => setIsCategoryOpen((prev) => !prev)}
          >
            <LayoutGrid size={16} />
            <span>
              {activeCategoryId
                ? getCategory(activeCategoryId).label
                : "카테고리"}
            </span>
            <ChevronDown size={16} />
          </button>
          {isCategoryOpen && (
            <ul className={desktopStyle.categoryMenu}>
              <li>
                <button
                  type="button"
                  className={`${desktopStyle.categoryOption} ${
                    activeCategoryId === null
                      ? desktopStyle.categoryOptionActive
                      : ""
                  }`}
                  onClick={() => selectCategory(null)}
                >
                  전체
                </button>
              </li>
              {CATEGORIES.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    className={`${desktopStyle.categoryOption} ${
                      activeCategoryId === category.id
                        ? desktopStyle.categoryOptionActive
                        : ""
                    }`}
                    onClick={() => selectCategory(category.id)}
                  >
                    <span
                      className={desktopStyle.categoryDot}
                      style={{ backgroundColor: category.color }}
                    />
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="button" className={desktopStyle.searchBtn}>
          검색
        </button>
      </div>

      {selected && (
        <aside className={desktopStyle.detailPanel}>
          <button
            type="button"
            className={desktopStyle.detailCloseBtn}
            onClick={handleClosePanel}
          >
            <X size={18} />
          </button>
          <img
            src={selected.image}
            alt={selected.name}
            className={desktopStyle.detailImage}
          />
          <div className={desktopStyle.detailBody}>
            {(() => {
              const category = getCategory(selected.categoryId);
              return (
                <span
                  className={desktopStyle.detailTag}
                  style={{
                    backgroundColor: category.tint,
                    color: category.color,
                  }}
                >
                  {category.label}
                </span>
              );
            })()}
            <span className={desktopStyle.detailTitle}>{selected.name}</span>
            <p className={desktopStyle.detailSummary}>{selected.summary}</p>
            <div className={desktopStyle.detailActions}>
              <button type="button" className={desktopStyle.relayStartBtn}>
                릴레이 시작하기
              </button>
              <button type="button" className={desktopStyle.relayDetailBtn}>
                릴레이 상세보기
              </button>
            </div>
          </div>
        </aside>
      )}

      <div className={desktopStyle.mapControls}>
        <button
          type="button"
          className={desktopStyle.controlBtn}
          aria-label="내 위치로 이동"
          onClick={moveToMyLocation}
        >
          <LocateFixed size={18} />
        </button>
        <div className={desktopStyle.zoomGroup}>
          <button
            type="button"
            className={desktopStyle.controlBtn}
            aria-label="확대"
            onClick={zoomIn}
          >
            <Plus size={18} />
          </button>
          <button
            type="button"
            className={desktopStyle.controlBtn}
            aria-label="축소"
            onClick={zoomOut}
          >
            <Minus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
