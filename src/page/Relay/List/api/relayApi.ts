export type RelayStatus = "진행중" | "대기중";

export type RelaySortOption = "latest" | "popular";

export interface RelayItem {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  status: RelayStatus;
  imageUrl: string;
  participantImages: string[];
  extraParticipantCount: number;
}

export interface GetRelayListParams {
  keyword?: string;
  category?: string;
  sort?: RelaySortOption;
  page?: number;
  pageSize?: number;
}

export interface GetRelayListResponse {
  items: RelayItem[];
  totalCount: number;
  totalPages: number;
}

export const RELAY_SORT_OPTIONS: { id: RelaySortOption; label: string }[] = [
  { id: "latest", label: "최신순" },
  { id: "popular", label: "인기순" },
];

const avatarUrl = (seed: number) => `https://i.pravatar.cc/40?img=${seed}`;

const MOCK_RELAYS: RelayItem[] = [
  {
    id: 1,
    title: "그리스 산토리니 7일",
    description: "에에헤럴드빛 바다와 하얀 건물이 어우러진 꿈같은 여행이 시작됩니다.",
    location: "그리스 산토리니",
    category: "nature",
    status: "진행중",
    imageUrl: "https://picsum.photos/seed/santorini/600/400",
    participantImages: [avatarUrl(1), avatarUrl(2), avatarUrl(3)],
    extraParticipantCount: 12,
  },
  {
    id: 2,
    title: "도쿄 감성 골목 여행",
    description: "현지인만 아는 숨은 골목과 감성 가득한 도쿄를 만나보세요.",
    location: "일본 도쿄",
    category: "city",
    status: "진행중",
    imageUrl: "https://picsum.photos/seed/tokyo/600/400",
    participantImages: [avatarUrl(4), avatarUrl(5), avatarUrl(6)],
    extraParticipantCount: 8,
  },
  {
    id: 3,
    title: "스위스 알프스 트레킹",
    description: "눈부신 알프스의 자연 속에서 진정한 힐링을 경험하세요.",
    location: "스위스 인터라켄",
    category: "nature",
    status: "진행중",
    imageUrl: "https://picsum.photos/seed/alps/600/400",
    participantImages: [avatarUrl(7), avatarUrl(8), avatarUrl(9)],
    extraParticipantCount: 16,
  },
  {
    id: 4,
    title: "프라하 감성 산책",
    description: "중세 유럽의 분위기를 간직한 프라하의 매력을 느껴보세요.",
    location: "체코 프라하",
    category: "culture",
    status: "대기중",
    imageUrl: "https://picsum.photos/seed/prague/600/400",
    participantImages: [avatarUrl(10), avatarUrl(11), avatarUrl(12)],
    extraParticipantCount: 7,
  },
  {
    id: 5,
    title: "방콕 미식 탐방",
    description: "태국 현지의 맛을 찾아 떠나는 방콕 미식 릴레이 여행.",
    location: "태국 방콕",
    category: "food",
    status: "진행중",
    imageUrl: "https://picsum.photos/seed/bangkok/600/400",
    participantImages: [avatarUrl(13), avatarUrl(14), avatarUrl(15)],
    extraParticipantCount: 10,
  },
  {
    id: 6,
    title: "모로코 사막 캠핑",
    description: "끝없이 펼쳐진 사막에서 특별한 캠핑 경험을 즐겨보세요.",
    location: "모로코 마라케시",
    category: "activity",
    status: "대기중",
    imageUrl: "https://picsum.photos/seed/morocco/600/400",
    participantImages: [avatarUrl(16), avatarUrl(17), avatarUrl(18)],
    extraParticipantCount: 5,
  },
  {
    id: 7,
    title: "로마 역사 유적 여행",
    description: "고대 로마의 역사와 유적을 따라 떠나는 시간 여행.",
    location: "이탈리아 로마",
    category: "culture",
    status: "진행중",
    imageUrl: "https://picsum.photos/seed/rome/600/400",
    participantImages: [avatarUrl(19), avatarUrl(20), avatarUrl(21)],
    extraParticipantCount: 11,
  },
  {
    id: 8,
    title: "발리 힐링 요가 여행",
    description: "자연 속에서 요가와 명상으로 몸과 마음을 치유하세요.",
    location: "인도네시아 발리",
    category: "nature",
    status: "진행중",
    imageUrl: "https://picsum.photos/seed/bali/600/400",
    participantImages: [avatarUrl(22), avatarUrl(23), avatarUrl(24)],
    extraParticipantCount: 9,
  },
  {
    id: 9,
    title: "뉴욕 5번가 쇼핑 투어",
    description: "세계적인 쇼핑 거리 5번가에서 즐기는 쇼핑 릴레이.",
    location: "미국 뉴욕",
    category: "city",
    status: "대기중",
    imageUrl: "https://picsum.photos/seed/newyork/600/400",
    participantImages: [avatarUrl(25), avatarUrl(26), avatarUrl(27)],
    extraParticipantCount: 13,
  },
  {
    id: 10,
    title: "아이슬란드 오로라 여행",
    description: "신비로운 오로라와 대자연의 경이로움을 만나보세요.",
    location: "아이슬란드 레이캬비크",
    category: "nature",
    status: "진행중",
    imageUrl: "https://picsum.photos/seed/iceland/600/400",
    participantImages: [avatarUrl(28), avatarUrl(29), avatarUrl(30)],
    extraParticipantCount: 14,
  },
  {
    id: 11,
    title: "파리 예술 산책",
    description: "예술과 낭만이 가득한 파리의 거리를 함께 걸어요.",
    location: "프랑스 파리",
    category: "culture",
    status: "대기중",
    imageUrl: "https://picsum.photos/seed/paris/600/400",
    participantImages: [avatarUrl(31), avatarUrl(32), avatarUrl(33)],
    extraParticipantCount: 6,
  },
  {
    id: 12,
    title: "캐나다 로키 하이킹",
    description: "웅장한 로키 산맥에서의 하이킹 릴레이.",
    location: "캐나다 밴프",
    category: "activity",
    status: "진행중",
    imageUrl: "https://picsum.photos/seed/banff/600/400",
    participantImages: [avatarUrl(34), avatarUrl(35), avatarUrl(36)],
    extraParticipantCount: 8,
  },
  {
    id: 13,
    title: "타이베이 야시장 투어",
    description: "대만의 다양한 야시장 음식과 문화를 경험해보세요.",
    location: "대만 타이베이",
    category: "food",
    status: "대기중",
    imageUrl: "https://picsum.photos/seed/taipei/600/400",
    participantImages: [avatarUrl(37), avatarUrl(38), avatarUrl(39)],
    extraParticipantCount: 9,
  },
  {
    id: 14,
    title: "두바이 럭셔리 여행",
    description: "화려한 도시 두바이에서의 럭셔리한 경험.",
    location: "아랍에미리트 두바이",
    category: "city",
    status: "진행중",
    imageUrl: "https://picsum.photos/seed/dubai/600/400",
    participantImages: [avatarUrl(40), avatarUrl(41), avatarUrl(42)],
    extraParticipantCount: 7,
  },
  {
    id: 15,
    title: "하노이 골목 여행",
    description: "베트남 하노이의 숨은 골목과 현지 문화를 만나보세요.",
    location: "베트남 하노이",
    category: "culture",
    status: "대기중",
    imageUrl: "https://picsum.photos/seed/hanoi/600/400",
    participantImages: [avatarUrl(43), avatarUrl(44), avatarUrl(45)],
    extraParticipantCount: 5,
  },
  {
    id: 16,
    title: "페루 잉카 문명 탐방",
    description: "잉카 문명의 신비를 따라 떠나는 페루 역사 여행.",
    location: "페루 쿠스코",
    category: "culture",
    status: "진행중",
    imageUrl: "https://picsum.photos/seed/peru/600/400",
    participantImages: [avatarUrl(46), avatarUrl(47), avatarUrl(48)],
    extraParticipantCount: 6,
  },
  {
    id: 17,
    title: "몰디브 휴양 릴레이",
    description: "몰디브의 아름다운 바다에서 완벽한 휴식을 즐기세요.",
    location: "몰디브 말레",
    category: "nature",
    status: "대기중",
    imageUrl: "https://picsum.photos/seed/maldives/600/400",
    participantImages: [avatarUrl(49), avatarUrl(50), avatarUrl(51)],
    extraParticipantCount: 10,
  },
  {
    id: 18,
    title: "싱가포르 야경 투어",
    description: "화려한 싱가포르의 야경을 함께 감상해요.",
    location: "싱가포르",
    category: "city",
    status: "진행중",
    imageUrl: "https://picsum.photos/seed/singapore/600/400",
    participantImages: [avatarUrl(52), avatarUrl(53), avatarUrl(54)],
    extraParticipantCount: 7,
  },
];

export const getRelayList = async (
  params: GetRelayListParams = {},
): Promise<GetRelayListResponse> => {
  const {
    keyword = "",
    category = "전체",
    sort = "latest",
    page = 1,
    pageSize = 18,
  } = params;

  const trimmedKeyword = keyword.trim();

  const filtered = MOCK_RELAYS.filter((relay) => {
    const matchesKeyword =
      !trimmedKeyword ||
      relay.title.includes(trimmedKeyword) ||
      relay.location.includes(trimmedKeyword) ||
      relay.description.includes(trimmedKeyword);
    const matchesCategory = category === "전체" || relay.category === category;
    return matchesKeyword && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "popular") {
      return b.extraParticipantCount - a.extraParticipantCount;
    }
    return a.id - b.id;
  });

  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  return { items, totalCount, totalPages };
};
