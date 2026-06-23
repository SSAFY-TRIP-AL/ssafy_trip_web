import { isMobile } from "react-device-detect";
import MyPageDesktop from "./ui/MyPageDesktop";
import MyPageMobile from "./ui/MyPageMobile";

export default function MyPage() {
  return isMobile ? <MyPageMobile /> : <MyPageDesktop />;
}
