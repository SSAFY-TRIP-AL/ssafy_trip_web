import { isMobile } from "react-device-detect";
import RelayListDesktop from "./ui/RelayListDesktop";

export default function RelayList() {
  return isMobile ? "" : <RelayListDesktop />;
}
