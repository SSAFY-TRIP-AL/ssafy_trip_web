import defaultProfile from "../assets/default_profile.svg";

export { defaultProfile };

/** 프로필 이미지가 없으면 기본 아바타를 반환 */
export const resolveProfileImage = (url?: string | null): string =>
  url && url.trim() ? url : defaultProfile;
