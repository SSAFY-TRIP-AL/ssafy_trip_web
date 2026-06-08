import { isMobile } from "react-device-detect";
import HeaderDesktop from "./ui/HeaderDesktop";

export default function Header() {
  return isMobile ? "" : <HeaderDesktop />;
}
