import { isMobile } from "react-device-detect";
import MyPageDesktop from "./ui/MyPageDesktop";

export default function MyPage() {
  return isMobile ? "" : <MyPageDesktop />;
}
